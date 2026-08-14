import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    green: {
        
      50: "#ebffe8",
    75: "#d9fad4",
      100: "#c6f5d1",
      200: "#a2e7b5",
      300: "#79d897",
      400: "#4fc979",
      500: "#38A926", // Primary green color used in backgrounds
      600: "#278c4b",
      700: "#1a6636",
      800: "#0e4121",
      900: "#03200d",
    },
    gray: {
      50: "#f9f9f9",
      100: "#e6e6e6",
      200: "#cccccc",
      300: "#b3b3b3",
      400: "#999999",
      500: "#808080", // Used in text colors
      600: "#666666",
      700: "#4d4d4d",
      800: "#333333",
      900: "#2e2e2e",
    },
  },
  fonts: {
    heading: "Sora, Poppins, sans-serif", // Assumed font based on modern designs
    body: "Montserrat, Roboto, sans-serif", // Assumed font based on modern designs
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "green.500",
          color: "white",
          _hover: {
            bg: "green.600",
          },
          _active: {
            bg: "green.700",
          },
        },
        outline: {
          borderColor: "green.500",
          color: "green.500",
          _hover: {
            bg: "green.50",
          },
          _active: {
            bg: "green.100",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: "green.500",
        _hover: {
          textDecoration: "underline",
          color: "green.600",
        },
      },
    },
    Text: {
      baseStyle: {
        color: "gray.800", // General text color
      },
      variants: {
        heading: {
          color: "green.600",
          fontWeight: "bold",
        },
      },
    },
    Box: {
      baseStyle: {
        borderRadius: "md",
      },
    },
    VStack: {
      baseStyle: {
        spacing: 4,
      },
    },
    HStack: {
      baseStyle: {
        spacing: 4,
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: "full",
      },
      variants: {
        ghost: {
          _hover: {
            bg: "green.100",
          },
          _active: {
            bg: "green.200",
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "green.50",
        color: "gray.800",
      },
      a: {
        color: "green.500",
        _hover: {
          textDecoration: "none",
          color: "green.600",
        },
      },
      button: {
        _hover: {
          bg: "green.600",
          color: "white",
        },
      },
    },
  },
});

export default theme;
