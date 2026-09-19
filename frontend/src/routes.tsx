import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppShell } from "./layout/AppShell";
import { BrowseDataSourcePage } from "./pages/BrowseDataSourcePage";
import { DataSourcesPage } from "./pages/DataSourcesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { VisualizePage } from "./pages/VisualizePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell><Navigate to="/data-sources" replace /></AppShell>,
  },
  { path: "/data-sources", element: <AppShell><DataSourcesPage /></AppShell> },
  { path: "/data-sources/:connectionId", element: <AppShell><BrowseDataSourcePage /></AppShell> },
  { path: "/visualize", element: <AppShell><VisualizePage /></AppShell> },
  { path: "/history", element: <AppShell><HistoryPage /></AppShell> },
  { path: "/settings", element: <AppShell><SettingsPage /></AppShell> },
]);
