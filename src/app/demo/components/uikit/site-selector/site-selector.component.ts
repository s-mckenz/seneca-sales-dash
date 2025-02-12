import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-site-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  providers: [Apollo],
  templateUrl: './site-selector.component.html',
  styleUrls: ['./site-selector.component.scss'],
})
export class SiteSelectorComponent implements OnInit {
  @Output() siteSelected = new EventEmitter<number>();

  selectedSite: { id: number; name: string } | null = null; // Declare selectedSite
  sites: { id: number; name: string }[] = []; // Array to hold dropdown options
  loading = true;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.fetchSites();
  }

  fetchSites(): void {
    const SITE_QUERY = gql`
    query GetSites {
  rds_cloud_Sites(
    where: { 
      clientId: { _eq: 109 }, 
      statusId: { _eq: 2 } 
    },
    order_by: { name: asc }  
  ) {
    id
    name
  }
}
  `;
  

    this.apollo
      .watchQuery<{ rds_cloud_Sites: { id: number; name: string }[] }>({
        query: SITE_QUERY,
      })
      .valueChanges.subscribe({
        next: (result) => {
          this.sites = result.data.rds_cloud_Sites;
          if (this.sites.length > 0) {
            this.selectedSite = this.sites[0]; // Default to the first item
            this.onSiteSelected(this.selectedSite); // Emit the default selection
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching sites:', error);
          this.loading = false;
        },
      });
  }

  onSiteSelected(event: { id: number; name: string }): void {
    if (event && event.id) {
      this.siteSelected.emit(event.id); // Emit the siteId of the selected site
    }
  }
}
