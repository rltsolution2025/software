// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaTruck, FaChartBar, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

// const WelcomeDashboard = () => {
//   const navigate = useNavigate();

//   const features = [
//     {
//       title: "Delivery Reports",
//       description: "Track item delivery status and ETA.",
//       icon: <FaTruck size={40} className="text-primary mb-3" />,
//       path: "/delivery-reports",
//     },
//     {
//       title: "Monthly Reports",
//       description: "Download monthly reports in Excel or PDF.",
//       icon: <FaChartBar size={40} className="text-success mb-3" />,
//       path: "/monthly-reports",
//     },
//     {
//       title: "Purchase Items",
//       description: "View total purchases for each month.",
//       icon: <FaShoppingCart size={40} className="text-warning mb-3" />,
//       path: "/purchase-items",
//     },
//     {
//       title: "Spending Overview",
//       description: "Track overall monthly spending.",
//       icon: <FaMoneyBillWave size={40} className="text-danger mb-3" />,
//       path: "/spending-overview",
//     },
//   ];

//   return (
//     <div className="container mt-5">
//       <div className="text-center mb-5">
//         <h3>👋 Welcome to Purchase & Inventory Dashboard</h3>
//         <p className="text-muted">
//           Manage your purchases, compare Excel sheets, and generate reports efficiently.
//         </p>
//       </div>

//       <div className="row g-4">
//         {features.map((feature, index) => (
//           <div key={index} className="col-md-3 col-sm-6">
//             <div
//               className="card h-100 text-center shadow-sm p-3 hover-card"
//               style={{ cursor: "pointer", borderRadius: "15px" }}
//               onClick={() => navigate(feature.path)}
//             >
//               {feature.icon}
//               <h5>{feature.title}</h5>
//               <p className="text-muted small">{feature.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WelcomeDashboard;

import React from "react";
import { FaTruck, FaChartBar, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

const WelcomeDashboard = ({ setSelectedItem }) => {
  const features = [
    {
      key: "Delivery",
      title: "Delivery Reports",
      description: "Track item delivery status and ETA.",
      icon: <FaTruck size={40} className="text-primary mb-3" />,
    },
    {
      key: "MonthlyReports",
      title: "Monthly Reports",
      description: "Download monthly reports in Excel or PDF.",
      icon: <FaChartBar size={40} className="text-success mb-3" />,
    },
    {
      key: "PurchaseOrder",
      title: "Purchase Items",
      description: "View total purchases for each month.",
      icon: <FaShoppingCart size={40} className="text-warning mb-3" />,
    },
    {
      key: "SpendingOverview",
      title: "Spending Overview",
      description: "Track overall monthly spending.",
      icon: <FaMoneyBillWave size={40} className="text-danger mb-3" />,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h3>👋 Welcome to Purchase & Inventory Dashboard</h3>
        <p className="text-muted">
          Manage your purchases, compare Excel sheets, and generate reports efficiently.
        </p>
      </div>

      <div className="row g-4">
        {features.map((feature, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div
              className="card h-100 text-center shadow-sm p-3 hover-card"
              style={{ cursor: "pointer", borderRadius: "15px" }}
              onClick={() => setSelectedItem(feature.key)}
            >
              {feature.icon}
              <h5>{feature.title}</h5>
              <p className="text-muted small">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeDashboard;
