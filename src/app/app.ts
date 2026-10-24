import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from './services/language';
import { VehicleService } from './services/vehicle';
import { ViewModeService } from './services/view-mode';
import { PriceAlertService } from './services/price-alert';
import { HeaderComponent } from './components/header/header';
import { TopPromoBannerComponent } from './components/top-promo-banner/top-promo-banner';
import { SpecialAnnouncesComponent } from './components/special-announces/special-announces';
import { SearchFilterBoxComponent } from './components/search-filter-box/search-filter-box';
import { PromoBannerComponent } from './components/promo-banner/promo-banner';
import { SidebarComponent } from './components/sidebar/sidebar';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar';
import { CarShowcaseRowComponent } from './components/car-showcase-row/car-showcase-row';
import { CatalogTabsComponent } from './components/catalog-tabs/catalog-tabs';
import { VehicleCardComponent } from './components/vehicle-card/vehicle-card';
import { BestSellersCategoryComponent } from './components/best-sellers-category/best-sellers-category';
import { PopularJapaneseCarsComponent } from './components/popular-japanese-cars/popular-japanese-cars';
import { PurchaseFlowComponent } from './components/purchase-flow/purchase-flow';
import { ReviewsComponent } from './components/reviews/reviews';
import { FaqComponent } from './components/faq/faq';
import { FooterComponent } from './components/footer/footer';
import { VehicleModalComponent } from './components/vehicle-modal/vehicle-modal';
import { QuoteModalComponent } from './components/quote-modal/quote-modal';
import { FavoritesModalComponent } from './components/favorites-modal/favorites-modal';
import { AuthModalComponent } from './components/auth-modal/auth-modal';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { SupportChatComponent } from './components/support-chat/support-chat';
import { MobileViewComponent } from './components/mobile-view/mobile-view';
import { ModelVehiclesPageComponent } from './components/model-vehicles-page/model-vehicles-page';
import { MobileVehicleDetailComponent } from './components/mobile-vehicle-detail/mobile-vehicle-detail';
import { PriceDropAlertModalComponent } from './components/price-alert-modal/price-alert-modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    MatIconModule,
    TopPromoBannerComponent,
    HeaderComponent,
    SpecialAnnouncesComponent,
    SearchFilterBoxComponent,
    PromoBannerComponent,
    SidebarComponent,
    RightSidebarComponent,
    CarShowcaseRowComponent,
    CatalogTabsComponent,
    VehicleCardComponent,
    BestSellersCategoryComponent,
    PopularJapaneseCarsComponent,
    PurchaseFlowComponent,
    ReviewsComponent,
    FaqComponent,
    FooterComponent,
    VehicleModalComponent,
    QuoteModalComponent,
    FavoritesModalComponent,
    AuthModalComponent,
    AdminPanelComponent,
    SupportChatComponent,
    MobileViewComponent,
    ModelVehiclesPageComponent,
    MobileVehicleDetailComponent,
    PriceDropAlertModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly lang = inject(LanguageService);
  readonly vehicleService = inject(VehicleService);
  readonly viewMode = inject(ViewModeService);
  readonly priceAlertService = inject(PriceAlertService);
}
