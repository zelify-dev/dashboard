import * as Icons from "../icons";
import type { UiTranslations } from "@/hooks/use-ui-translations";

export function getNavData(translations: UiTranslations) {
  return [
    {
      label: translations.sidebar.mainMenu,
      items: [
        {
          title: translations.sidebar.menuItems.dashboard,
          icon: Icons.HomeIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.ecommerce,
              url: "/",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.calendar,
          url: "/calendar",
          icon: Icons.Calendar,
          items: [],
        },
        {
          title: translations.sidebar.menuItems.organization,
          icon: Icons.Organization,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.profile,
              url: "/profile",
            },
            {
              title: translations.sidebar.menuItems.subItems.teams,
              url: "/organization/teams",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.zelifyKeys,
          url: "/pages/zelifykeys",
          icon: Icons.Key,
          items: [],
        },
        {
          title: translations.sidebar.menuItems.allProducts,
          url: "/pages/products",
          icon: Icons.ProductsIcon,
          items: [],
        },
        {
          title: translations.sidebar.menuItems.logs,
          url: "/pages/infologs",
          icon: Icons.LogsIcon,
          items: [],
        },
        {
          title: translations.sidebar.menuItems.webhooks,
          url: "/pages/webhooks",
          icon: Icons.WebhooksIcon,
          items: [],
        },
      ],
    },
    {
      label: translations.sidebar.products,
      items: [
        {
          title: translations.sidebar.menuItems.auth,
          icon: Icons.Authentication,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.authentication,
              url: "/pages/products/auth/authentication",
            },
            {
              title: translations.sidebar.menuItems.subItems.geolocalization,
              url: "/pages/products/auth/geolocalization",
            },
            {
              title: translations.sidebar.menuItems.subItems.deviceInformation,
              url: "/pages/products/auth/device-information",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.aml,
          icon: Icons.AMLIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.validationGlobalList,
              url: "/pages/products/aml/validation-global-list",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.identity,
          icon: Icons.IdentityIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.workflow,
              url: "/pages/products/identity/workflow",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.connect,
          icon: Icons.ConnectIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.bankAccountLinking,
              url: "/pages/products/connect/bank-account-linking",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.cards,
          icon: Icons.CardsIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.issuing,
              items: [
                {
                  title: translations.sidebar.menuItems.subItems.design,
                  url: "/pages/products/cards/issuing/design",
                },
              ],
            },
            {
              title: translations.sidebar.menuItems.subItems.transactions,
              url: "/pages/products/cards/transactions",
            },
            {
              title: translations.sidebar.menuItems.subItems.diligence,
              url: "/pages/products/cards/diligence",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.transfers,
          icon: Icons.TransfersIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.basicService,
              url: "/pages/products/payments/servicios-basicos",
            },
            {
              title: translations.sidebar.menuItems.subItems.transfers,
              url: "/pages/products/payments/transfers",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.tx,
          icon: Icons.TxIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.internationalTransfers,
              url: "/pages/products/tx/transferencias-internacionales",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.ai,
          icon: Icons.AIIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.alaiza,
              url: "/pages/products/ai/alaiza",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.payments,
          icon: Icons.ProductsIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.customKeys,
              url: "/pages/products/payments/custom-keys",
            },
            {
              title: translations.sidebar.menuItems.subItems.qr,
              url: "/pages/products/payments/qr",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.notifications,
          icon: Icons.NotificationsIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.templates,
              url: "/pages/products/notifications",
            },
            {
              title: translations.sidebar.menuItems.subItems.domains,
              url: "/pages/products/notifications/domains",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.discountsCoupons,
          icon: Icons.DiscountsIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.coupons,
              url: "/pages/products/discounts-coupons",
            },
            {
              title: translations.sidebar.menuItems.subItems.createCoupon,
              url: "/pages/products/discounts-coupons/create",
            },
            {
              title: translations.sidebar.menuItems.subItems.analyticsUsage,
              url: "/pages/products/discounts-coupons/analytics",
            },
          ],
        },
        {
          title: translations.sidebar.menuItems.insurance,
          icon: Icons.InsuranceIcon,
          items: [
            {
              title: translations.sidebar.menuItems.subItems.insuranceAssistance,
              url: "/pages/products/insurance/assistance",
            },
            {
              title: translations.sidebar.menuItems.subItems.quoteInsurance,
              url: "/pages/products/insurance/quote",
            },
          ],
        },
      ],
    },
  ];
}
