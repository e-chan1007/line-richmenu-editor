import Stack from "@material-ui/core/Stack";
import { useTheme } from "@material-ui/core/styles";
import React from "react";
import styles from "styles/Phone.module.scss";

export default function Phone({ children }: {children}) {
  const theme = useTheme();
  return (
    <Stack sx={{ mb: 2 }} direction="row" justifyContent="center">
      <div className={theme.palette.mode === "dark" ? [styles.device, styles["is-dark"]].join(" ") : styles.device}>
        <div className={styles.device__speaker} />
        <div className={styles.device__screen}>
          {children}
        </div>
      </div>
    </Stack>
  );
}
