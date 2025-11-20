import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Organization",
        icon: Icons.Organization,
        items: [
          {
            title: "Profile",
            url: "/profile",
          },
          {
            title: "Teams",
            url: "/organization/teams",
          },
        ],
      },
      {
        title: "Zelify Keys",
        url: "/pages/zelifykeys",
        icon: Icons.Key,
        items: [],
      },
      {
        title: "All products",
        url: "/pages/products",
        icon: Icons.ProductsIcon,
        items: [],
      },
      {
        title: "Logs",
        url: "/pages/infologs",
        icon: Icons.LogsIcon,
        items: [],
      },
      {
        title: "Webhooks",
        url: "/pages/webhooks",
        icon: Icons.WebhooksIcon,
        items: [],
      },
    ],
  },
  {
    label: "PRODUCTS",
    items: [
      {
        title: "Auth",
        icon: Icons.Authentication,
        items: [
          {
            title: "Authentication",
            url: "/pages/products/auth/authentication",
          },
          {
            title: "Geolocalization",
            url: "/pages/products/auth/geolocalization",
          },
          {
            title: "Device information",
            url: "/pages/products/auth/device-information",
          },
        ],
      },
      {
        title: "AML",
        icon: Icons.AMLIcon,
        items: [
          {
            title: "Validación de listas globales",
            url: "/pages/products/aml/validation-global-list",
          },
        ],
      },
      {
        title: "Identity",
        icon: Icons.IdentityIcon,
        items: [
          {
            title: "Workflow",
            url: "/pages/products/identity/workflow",
          },
        ],
      },
      {
        title: "Connect",
        icon: Icons.ConnectIcon,
        items: [
          {
            title: "Bank account linking",
            url: "/pages/products/connect/bank-account-linking",
          },
        ],
      },
      {
        title: "Cards",
        icon: Icons.CardsIcon,
        items: [
          {
            title: "Issuing",
            items: [
              {
                title: "Design",
                url: "/pages/products/cards/issuing/design",
              },
            ],
          },
          {
            title: "Transactions",
            url: "/pages/products/cards/transactions",
          },
          {
            title: "Diligence",
            url: "/pages/products/cards/diligence",
          },
        ],
      },
      {
        title: "Transfers",
        icon: Icons.TransfersIcon,
        items: [
          {
            title: "Basic Service",
            url: "/pages/products/payments/servicios-basicos",
          },
          {
            title: "Transfers",
            url: "/pages/products/payments/transfers",
          },
        ],
      },
      {
        title: "Tx",
        icon: Icons.TxIcon,
        items: [
          {
            title: "International transfers",
            url: "/pages/products/tx/transferencias-internacionales",
          },
        ],
      },
      {
        title: "AI",
        icon: Icons.AIIcon,
        items: [
          {
            title: "Alaiza",
            url: "/pages/products/ai/alaiza",
          },
        ],
      },
      {
        title: "Payments",
        icon: Icons.ProductsIcon,
        items: [
          {
            title: "Custom Keys",
            url: "/pages/products/payments/custom-keys",
          },
          {
            title: "QR",
            url: "/pages/products/payments/qr",
          },
        ],
      },
      {
        title: "Discounts & Coupons",
        icon: Icons.DiscountsIcon,
        items: [
          {
            title: "Coupons",
            url: "/pages/products/discounts-coupons",
          },
          {
            title: "Create Coupon",
            url: "/pages/products/discounts-coupons/create",
          },
          {
            title: "Analytics & Usage",
            url: "/pages/products/discounts-coupons/analytics",
          },
        ],
      },
      {
        title: "Insurance",
        icon: Icons.InsuranceIcon,
        items: [
          {
            title: "Insurance Assistance",
            url: "/pages/products/insurance/assistance",
          },
          {
            title: "Quote Insurance",
            url: "/pages/products/insurance/quote",
          },
        ],
      },
    ],
  },
];
