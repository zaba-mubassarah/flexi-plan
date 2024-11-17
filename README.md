# Flexiplan

Flexiplan is a responsive **Next.js** TypeScript-based application that allows users to customize their mobile plans dynamically. Users can select different options such as validity, internet, voice, and SMS, and toggle additional features like missed call alerts. The selected options are displayed in a summary section for easy review.

---

## Features

- **Dynamic Selection**: Users can choose from different categories, including validity, data, voice minutes, SMS, and more.
- **Eligibility-based Filtering**: Options for some categories are dynamically filtered based on the selected validity.
- **Missed Call Alert Toggle**: Users can enable or disable the missed call alert feature with a toggle button.
- **Responsive Design**: The layout adjusts for various screen sizes, ensuring a great user experience on both desktop and mobile devices.
- **Real-Time Summary**: Displays all selected options in a summary section for quick review.

---

## Tech Stack

- **Next.js**: A React framework for server-side rendering and static site generation.
- **TypeScript**: For static typing and better developer experience.
- **Tailwind CSS**: For modern, utility-first styling.
- **JSON Data**: Used for managing mock data for bubbles and eligibility mapping.

---

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/zaba-mubassarah/flexi-plan.git
cd flexi-plan

# Install dependencies
npm install
# Or with Yarn
yarn install

# Run the development server
npm run dev
# Or with Yarn
yarn dev

# Open your browser and navigate to
http://localhost:3000
