# Project: AgriAI

This project addresses the critical issue of exploitative middlemen in Pakistan's agricultural market by creating a direct marketplace connecting farmers with buyers. The platform features AI-powered voice interaction in Urdu to support farmers with limited literacy, along with a regulated bidding system that protects both parties.

---

## *Core Problems Addressed*

1. *Elimination of Exploitative Middlemen*
   - Direct connection between farmers and end buyers
   - Fair price discovery through transparent bidding
   - Removal of unnecessary price markups

2. *Accessibility for Farmers*
   - Urdu speech recognition for farmer interactions
   - AI agent assistance for registration and crop listings
   - Voice-guided interface requiring minimal reading

3. *Price Regulation*
   - Bidding starts at farmer's set price
   - Maximum bid capped at government-regulated prices
   - Protection against price manipulation

---

## *Technologies Used*

### *Frontend (Next.js)*
- React with hooks for UI components
- AWS Transcribe for speech-to-text
- AWS Polly for text-to-speech in Urdu
- WebSocket for real-time bidding
- Tailwind CSS for styling

### *Backend*
- Next.js API routes for core functionality
- MongoDB for database operations
- AWS Lambda for serverless speech processing
- WebSocket API for bidding system

---

## *Features*

### *Farmer Features (Voice-Enabled)*
1. *Voice Registration*
   - Urdu speech recognition for farmer details
   - AI agent guidance throughout process
   - Automatic CNIC and phone verification

2. *Crop Management*
   - Voice-based crop listing
   - Speech input for quantity and base price
   - Audio confirmations in Urdu

3. *Bid Monitoring*
   - Audio notifications for new bids
   - Voice commands to accept/reject bids
   - Spoken price updates

### *Buyer Features*
1. *Crop Discovery*
   - Search available crops
   - View farmer ratings and history
   - Filter by location and price

2. *Bidding System*
   - Real-time bid placement
   - Automatic price cap enforcement
   - Instant bid notifications

3. *Direct Communication*
   - In-app messaging with farmers
   - WhatsApp integration
   - Bid status tracking

### *Price Control Features*
1. *Government Price Integration*
   - Daily updates of maximum allowed prices
   - Automatic bid capping
   - Price trend analytics

2. *Bidding Rules*
   - Minimum increment amounts
   - Maximum price enforcement
   - Time-based bidding windows

---

## *Project Setup*

### *Backend (Django)*

1. *Change Directory:*
    - ``` cd backend ```

2. *Install Dependencies:*
   - ``` pip install -r requirements.txt ```   

3. *Run Migrations:*
   - ``` python manage.py makemigrations ```
   - ``` python manage.py migrate ```   

4. *Start the Server:*
   - ``` python manage.py runserver ```
   

### *Frontend (Next.js)*

1. *Change directory:*
   - ``` cd project ```

2. *Install Dependencies:*
   - ``` npm install ```

3. *Run the Development Server:*
   - ``` npm run dev ```
