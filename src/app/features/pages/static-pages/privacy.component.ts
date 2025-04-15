import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {
  lastUpdated = 'June 1, 2024';

  sections = [
    {
      id: 'information-collected',
      title: 'Information We Collect',
      content: 'We collect information that you provide directly when you:',
      items: [
        'Create an account',
        'Make a booking or reservation',
        'Contact our customer service'
      ],
      additional: 'We also automatically collect certain technical information when you visit our website.'
    },
    {
      id: 'how-we-use',
      title: 'How We Use Information',
      content: 'We use the information we collect to:',
      items: [
        'Provide and improve our services',
        'Process transactions',
        'Communicate with you',
        'Ensure security and prevent fraud'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies',
      content: 'We use cookies and similar tracking technologies to:',
      items: [
        'Remember your preferences',
        'Analyze site traffic',
        'Deliver personalized content'
      ],
      additional: 'You can control cookies through your browser settings.'
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      content: 'You have the right to:',
      items: [
        'Access your personal data',
        'Request correction of inaccurate information',
        'Request deletion of your data',
        'Object to certain processing activities'
      ],
      additional: 'To exercise these rights, please contact us at privacy@example.com.'
    }
  ];
}
