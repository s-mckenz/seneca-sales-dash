import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BannerComponent } from '../../uikit/banner/banner.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { LayoutService, ColorScheme } from 'src/app/layout/service/app.layout.service';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BannerComponent,
    TableModule,
    MultiSelectModule,
    CalendarModule,
    SidebarModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('dashboard') dashboard!: ElementRef;
  isFullscreen: boolean = false;
  siteSidebarVisible: boolean = false;
  siteOptions: any[] = [];
  selectedSiteIds: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  message: string = '';
  messageType: 'info' | 'error' = 'info';

  private originalColorScheme: ColorScheme = 'light';

  constructor(
    private layoutService: LayoutService,
    private apollo: Apollo,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    await this.loadSiteOptions();
  }

  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  async loadSiteOptions() {
    try {
      const query = gql`
        query fetchSenecaSites {
          rds_cloud_Clients(where: {id: {_eq: 199}}) {
            Sites(where: {statusId: {_eq: 2}}, order_by: {name: asc}) {
              id
              name
            }
          }
        }
      `;
      const result: any = await this.apollo.query({ query }).toPromise();
      this.siteOptions = result.data.rds_cloud_Clients[0].Sites.map((site: any) => ({
        label: site.name,
        value: site.id
      }));
    } catch (error) {
      console.error('Error fetching sites:', error);
      this.showMessage('Error fetching site options', 'error');
    }
  }

  // This getter computes the full site objects based on the selected IDs.
  get selectedSites() {
    if (!this.selectedSiteIds) {
        return [];
    }
    return this.siteOptions.filter(site => this.selectedSiteIds.includes(site.value));
  }

  exportData() {
    // Validate that dates and site selection are provided
    if (!this.startDate || !this.endDate || this.selectedSiteIds.length === 0) {
      this.showMessage('Please select sites and a valid date range.', 'error');
      return;
    }
    
    // Hard-coded client ID TODO: Make this dynamic using a user service
    const clientId = 199;
    
    // Determine if all sites have been selected
    const allSitesSelected = this.siteOptions.length === this.selectedSiteIds.length;
    
    // Prepare the export body based on the selection:
    let requestBody: any;
    if (allSitesSelected) {
      // If all sites are selected, pass the clientId (and omit siteIds)
      requestBody = {
        siteIds: null,
        clientId: clientId,
        startDate: this.startDate,
        endDate: this.endDate
      };
    } else {
      // Otherwise, pass the selected site IDs (and no clientId)
      requestBody = {
        siteIds: this.selectedSiteIds,
        clientId: clientId, //TODO: Remove this once the API is updated
        startDate: this.startDate,
        endDate: this.endDate
      };
    }
    
    // Log the request details
    console.log("Export Request Body:", requestBody);
    this.showMessage("Orders are being exported. Please check your email for updates.", "info");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = '';
    let body = {};
    if (this.selectedSiteIds.length > 0) {
      this.selectedSiteIds.forEach(siteId => {
         url = "https://bmdpppgagg.us-east-1.awsapprunner.com/exportAccountDetailForSite";
        body = {
          clientId: clientId,
          siteId: siteId,
          startDate: this.startDate,
          endDate: this.endDate
        };
    
        this.http.post(url, body, { headers }).subscribe(
          response => {
            // Handle response per site
            console.log(`Success for site ${siteId}`, response);
          },
          error => {
            // Handle error per site
            console.error(`Error for site ${siteId}`, error);
          }
        );
      });
    } else {
      url = "https://bmdpppgagg.us-east-1.awsapprunner.com/exportHouseAccountDetail";
      body = {
        clientId: clientId,
        siteId: null,
        startDate: this.startDate,
        endDate: this.endDate
      };
    
      this.http.post(url, body, { headers }).subscribe(
        response => {
          console.log("Success for all-house export", response);
        },
        error => {
          console.error("Error for all-house export", error);
        }
      );
    }
      
    
    // POST the export request using HttpClient
    this.http.post(url, JSON.stringify(body), { headers })
      .subscribe({
        next: (response) => {
          console.log("Export API Response:", response);
          this.showMessage("Export success", "info");
        },
        error: (error) => {
          console.error("Export API Error:", error);
          this.showMessage("Export error: " + error, "error");
        }
      });
  }
  

  presentDashboard() {
    const elem = this.dashboard.nativeElement;
    this.layoutService.config.update((config) => ({ ...config, colorScheme: 'dim' }));
    if (elem.requestFullscreen) elem.requestFullscreen();
    this.isFullscreen = true;
  }

  private onFullscreenChange() {
    if (!document.fullscreenElement) {
      this.isFullscreen = false;
      this.resetColorScheme();
    }
  }

  private resetColorScheme() {
    this.layoutService.config.update((config) => ({ ...config, colorScheme: this.originalColorScheme }));
  }

  public async logOut() {
    try {
      await signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.showMessage('Logout failed.', 'error');
    }
  }

  showMessage(text: string, type: 'info' | 'error') {
    this.message = text;
    this.messageType = type;
  }

  onMultiselectChange() {
    // Normalize to an empty array if the model becomes null.
    if (!this.selectedSiteIds) {
      this.selectedSiteIds = [];
    }
  }

  onMultiselectCloseup() {
    if (!this.selectedSiteIds || this.selectedSiteIds.length === 0) {
      this.siteSidebarVisible = false;
    } else {
      this.siteSidebarVisible = true;
    }
  }
}
