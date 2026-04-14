import React from "react";

import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import styles from "@/styles/Phone.module.scss";

export default function Phone({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Stack sx={{ mb: 2, justifyContent: "center" }} direction="row">
      <div className={theme.palette.mode === "dark" ? [styles.device, styles["is-dark"]].join(" ") : styles.device}>
        <div className={styles.device__speaker} />
        <div className={styles.device__screen}>
          {children}
        </div>
      </div>
    </Stack>
  );
}
