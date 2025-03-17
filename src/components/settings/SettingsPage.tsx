import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Header from "../layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Gamepad2,
  Shield,
} from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoMatchmaking, setAutoMatchmaking] = React.useState(false);
  const [showRankedGames, setShowRankedGames] = React.useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your game experience
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs defaultValue="appearance">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {theme === "dark" ? (
                            <Moon className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Sun className="h-5 w-5 text-muted-foreground" />
                          )}
                          <Label htmlFor="theme-mode">Dark Mode</Label>
                        </div>
                        <Switch
                          id="theme-mode"
                          checked={theme === "dark"}
                          onCheckedChange={(checked) =>
                            setTheme(checked ? "dark" : "light")
                          }
                        />
                      </div>

                      <Separator />

                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred theme for the application.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="gameplay" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {soundEnabled ? (
                            <Volume2 className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <VolumeX className="h-5 w-5 text-muted-foreground" />
                          )}
                          <Label htmlFor="sound-effects">Sound Effects</Label>
                        </div>
                        <Switch
                          id="sound-effects"
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor="auto-matchmaking">
                            Auto Matchmaking
                          </Label>
                        </div>
                        <Switch
                          id="auto-matchmaking"
                          checked={autoMatchmaking}
                          onCheckedChange={setAutoMatchmaking}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor="ranked-games">
                            Show Ranked Games
                          </Label>
                        </div>
                        <Switch
                          id="ranked-games"
                          checked={showRankedGames}
                          onCheckedChange={setShowRankedGames}
                        />
                      </div>

                      <Separator />

                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Configure gameplay settings and preferences.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {notificationsEnabled ? (
                            <Bell className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <BellOff className="h-5 w-5 text-muted-foreground" />
                          )}
                          <Label htmlFor="notifications">Notifications</Label>
                        </div>
                        <Switch
                          id="notifications"
                          checked={notificationsEnabled}
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>

                      <Separator />

                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          Manage notification preferences for game invites,
                          friend requests, and system updates.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>

                <Separator />

                <div className="pt-2 space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
