// import React from "react";
// import { Box, Typography, Link, Container, Grid } from "@mui/material";

// const Footer = () => {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: "#1c1c1c",
//         color: "white",
//         py: 3,
//         mt: "auto",
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={3}>
//           {/* Column 1 */}
//           <Grid item xs={12} sm={4}>
//             <Typography variant="h6" gutterBottom>
//               About Us
//             </Typography>
//             <Typography variant="body2">
//               We are dedicated to providing excellent services to our users.
//             </Typography>
//           </Grid>

//           {/* Column 2 */}
//           <Grid item xs={12} sm={4}>
//             <Typography variant="h6" gutterBottom>
//               Quick Links
//             </Typography>
//             <Box>
//               <Link href="/home" color="inherit" underline="hover">
//                 Home
//               </Link>
//             </Box>
//             <Box>
//               <Link href="/services" color="inherit" underline="hover">
//                 Services
//               </Link>
//             </Box>
//             <Box>
//               <Link href="/contact" color="inherit" underline="hover">
//                 Contact
//               </Link>
//             </Box>
//           </Grid>

//           {/* Column 3 */}
//           <Grid item xs={12} sm={4}>
//             <Typography variant="h6" gutterBottom>
//               Follow Us
//             </Typography>
//             <Box>
//               <Link
//                 href="https://facebook.com"
//                 color="inherit"
//                 underline="hover"
//                 target="_blank"
//                 rel="noopener"
//               >
//                 Facebook
//               </Link>
//             </Box>
//             <Box>
//               <Link
//                 href="https://twitter.com"
//                 color="inherit"
//                 underline="hover"
//                 target="_blank"
//                 rel="noopener"
//               >
//                 Twitter
//               </Link>
//             </Box>
//             <Box>
//               <Link
//                 href="https://instagram.com"
//                 color="inherit"
//                 underline="hover"
//                 target="_blank"
//                 rel="noopener"
//               >
//                 Instagram
//               </Link>
//             </Box>
//           </Grid>
//         </Grid>

//         <Typography
//           variant="body2"
//           align="center"
//           sx={{ mt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.2)", pt: 2 }}
//         >
//           &copy; {new Date().getFullYear()} Your Company. All rights reserved.
//         </Typography>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>© {currentYear} Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
