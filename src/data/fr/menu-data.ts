import { serloDomain } from '../../helper/serlo-domain'
import { InstanceData, LandingSubjectsData } from '@/data-types'

export const landingSubjectsData: LandingSubjectsData = {
  subjects: [],
  additionalLinks: [],
}

export const headerData: InstanceData['headerData'] = [
  {
    url: '',
    title: 'Matières',
    icon: 'subject',
    children: [
      { url: '/141585', title: 'Mathématiques' },
      { url: '/148617', title: 'Boîte à méthodes' },
      { url: '/141604', title: 'Nouvelle matières' },
    ],
  },
  { url: '/23727', title: 'À propos de serlo', icon: 'about' },
  { url: '/27469', title: 'Participe!', icon: 'participate' },
  {
    url: '',
    title: 'Communauté',
    icon: 'community',
    children: [
      {
        url: '/35587',
        title: 'Page de démarrage pour les auteurs',
      },
      { url: 'https://community.serlo.org/', title: 'Chat pour les auteurs' },
      { url: '/entity/unrevised', title: 'Modifications non révisées' },
    ],
  },
]

export const footerData: InstanceData['footerData'] = {
  footerNavigation: [
    {
      title: 'Général',
      children: [
        { title: 'À propos de serlo', url: '/serlo' },
        { title: 'Participes!', url: '/141581' },
        { title: 'Contact', url: '/41043' },
        {
          title: "Serlo dans d'autres langues",
          url: `https://en.${serloDomain}/global`,
        },
        {
          title: 'API',
          url: `https://en.${serloDomain}/community/technology-and-development/content-api`,
        },
      ],
    },
    {
      title: 'Restez en contact',
      children: [
        {
          title: 'GitHub',
          url: 'https://github.com/serlo',
          icon: 'github',
        },
      ],
    },
    {
      title: 'Termes légaux',
      children: [
        { title: 'Privacy Policy', url: `https://de.${serloDomain}/privacy` },
        {
          title: 'Revoke consent',
          url: `/consent`,
        },
        {
          title: "Conditions d'utilisation",
          url: `https://de.${serloDomain}/terms`,
        },
        { title: 'Imprimer', url: `https://de.${serloDomain}/imprint` },
      ],
    },
  ],
  aboutHref: '/serlo',
  participationHref: '/27469',
  donationHref: '/spenden',
}
