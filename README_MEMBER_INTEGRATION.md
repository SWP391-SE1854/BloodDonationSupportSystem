
# Member Portal Integration Guide

This member portal is designed to be easily integrated into your existing blood donation project.

## Files Structure
```
src/components/member/
├── index.ts                    # Export file for easy imports
├── MemberPortal.tsx           # Main container component
├── MemberLayout.tsx           # Layout with sidebar navigation
├── MemberDashboard.tsx        # Member dashboard view
├── MemberProfile.tsx          # Profile management
├── MemberDonationRequest.tsx  # Create donation requests
├── MemberHealthRecords.tsx    # View health records
└── MemberDonationHistory.tsx  # View donation history
```

## Integration Options

### Option 1: Copy & Paste (Minimal Changes)
1. Copy the entire `src/components/member/` folder to your project
2. Import and use `MemberPortal` component:

```tsx
import { MemberPortal } from '@/components/member';

// In your main component:
const user = {
  user_id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: 'member'
};

<MemberPortal 
  user={user} 
  onLogout={() => handleLogout()} 
/>
```

### Option 2: Individual Components
Import specific components as needed:

```tsx
import { 
  MemberDashboard, 
  MemberProfile, 
  MemberDonationRequest 
} from '@/components/member';
```

## Database Schema Compatibility
Components are built according to your database schema:

- **Users table**: name, email, phone, dob, address, city, district
- **HealthRecords table**: weight, height, blood_type, allergies, medication
- **DonationRequests table**: requested_date, note, status
- **DonationHistories table**: donation_date, component, location, quantity

## Styling
- Uses Tailwind CSS classes
- Medical theme with red and white colors
- Responsive design
- Consistent with blood donation aesthetics

## Required Dependencies
- React
- Lucide React (for icons)
- Tailwind CSS

## Customization
You can easily modify:
- Color scheme in the CSS classes
- Layout structure
- Form fields to match your exact database schema
- API integration points (currently uses mock data)

## API Integration Points
To connect to your backend, update these functions:
- Form submissions in components
- Data fetching for records
- User profile updates
- Authentication handling

The components are designed to work standalone and can be easily integrated into any React-based blood donation system.
