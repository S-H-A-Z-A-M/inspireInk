import React from "react";
import { Box, Typography, Link, Container, Grid } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1c1c1c",
        color: "white",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Column 1 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We are dedicated to providing excellent services to our users.
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/home" color="inherit" underline="hover">
                Home
              </Link>
            </Box>
            <Box>
              <Link href="/services" color="inherit" underline="hover">
                Services
              </Link>
            </Box>
            <Box>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <Link
                href="https://facebook.com"
                color="inherit"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Facebook
              </Link>
            </Box>
            <Box>
              <Link
                href="https://twitter.com"
                color="inherit"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Twitter
              </Link>
            </Box>
            <Box>
              <Link
                href="https://instagram.com"
                color="inherit"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Instagram
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.2)", pt: 2 }}
        >
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
