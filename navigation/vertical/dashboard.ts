export default [
  {
    title: 'Dashboards',
    icon: { icon: 'ri-home-smile-line' },
    to: 'dashboards-crm'
  },
  {
    title: 'Participant',
    icon: { icon: 'ri-user-follow-line' },
    children: [
      {
        title: 'Data Participant',
        icon: { icon: 'ri-user-line' },
        to: 'participant-data'
      },
      {
        title: 'Invoice',
        icon: { icon: 'ri-article-line' },
        to: 'participant-invoice'
      },
    ],
  },
  {
    title: 'Refund',
    icon: { icon: 'ri-refund-2-line' },
    to: 'refund'
  },
  {
    title: 'Merchandise',
    icon: { icon: 'ri-list-check-3' },
    to: 'merchandise'
  },
  {
    title: 'Page Content',
    icon: { icon: 'ri-layout-5-line' },
    children: [
      {
        title: 'Hero Banner',
        icon: { icon: 'ri-slideshow-fill' },
        to: 'content-hero'
      },
      {
        title: 'Technical Information',
        icon: { icon: 'ri-information-2-line' },
        to: 'content-technical-information'
      },
      {
        title: 'Reward',
        icon: { icon: 'ri-gift-2-line' },
        to: 'content-reward'
      },
      {
        title: 'FAQ',
        icon: { icon: 'ri-questionnaire-line' },
        to: 'content-faq'
      },
      {
        title: 'Partner',
        icon: { icon: 'ri-global-fill' },
        to: 'content-partner'
      }
    ]
  },
  {
    title: 'Management User',
    icon: { icon: 'ri-list-settings-line' },
    children: [
      {
        title: 'User',
        icon: { icon: 'ri-user-5-line' },
        to: 'management-user',
      },
      {
        title: 'Level',
        icon: { icon: 'ri-bubble-chart-line' },
        to: 'management-role',
      },
    ],
  }
]
