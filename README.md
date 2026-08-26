# FixNear 

FixNear is a MERN Stack service marketplace that helps users find and book trusted local professionals for everyday services such as plumbing, electrical work, painting, carpentry, cleaning, AC repair, and more.

The platform is designed to connect customers with nearby professionals based on their service requirements and location.

---


- Browse available services
- Search and filter services
- View service details
- Find professionals
- Search professionals by name or profession
- Filter professionals by service, rating, and availability
- View professional profiles
- Book a professional
- Manage bookings
- Leave ratings and reviews
- Save favorite professionals
- Manage profile

###  Professional

- Create a professional account
- Add offered services
- Create and manage professional profile
- Set availability
- Receive job requests
- Accept or reject bookings
- Manage active and completed jobs
- Track earnings
- View customer reviews
- Manage portfolio

###  Admin

- Admin dashboard
- Manage users
- Manage professionals
- Verify professionals
- Manage services
- Manage bookings
- Manage reviews
- View reports and statistics

###  Location-Based Matching

One of the core features of FixNear is location-based professional discovery.

The planned flow is:

```text
User Location
      ↓
Latitude + Longitude
      ↓
Backend API
      ↓
MongoDB Geospatial Query
      ↓
Nearby Professionals
      ↓
Distance + Rating + Availability
