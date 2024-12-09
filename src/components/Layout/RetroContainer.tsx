import styled from "styled-components";
import { motion } from "framer-motion";

export const RetroContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.text};

  // CRT screen effect
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent 0%,
      rgba(32, 128, 32, 0.2) 2%,
      transparent 3%
    );
    animation: scanline 7.5s linear infinite;
    pointer-events: none;
  }

  @keyframes scanline {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;
