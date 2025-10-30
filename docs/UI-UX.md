UX-UI Choices for Delivra

App is designed from the user's perspective. The user being the warehouse manager, the app is a tool to help them manage their deliveries.

## App Structure

The app is divided into three main sections:

- Dashboard: The main screen where the user can see their deliveries and manage their drivers.
- Map: The map screen shows the user's current location and the route to their delivery destination.
- Scan: The scan screen is used to scan a QR code from the driver's phone.

## Dashboard

The dashboard is the main screen where the user can see some cards such as:
-DRIVER CARD/SHEET(also present in map screen via clicking on the truck icon)
initially had this only in there but decided to add it to the dashboard as well to avoid adding an onboarding flow and give the user a quick glance not only at that but also at some other key features like map,scan and packages.

-Initially had this screen follow the same UI pattern as the Settings screen (void black with muted cards) but decided to change it to a softer black to avoid eye strain as the user will be using it for a longer period of time compared to the settings screen.

The dashboard is especially important for the discoverability of the packages screen as it was initially "hidden" under several clicks truck icon click>driver sheet>packages screen. This provides the user with easier access while keeping the option to access packages screen from the usual way.

## Map

If dashboard didn't exist this could make up 80% of the app, even considered adding settings screen access here initially via an icon on the top right but eventually opted to keep it as a separate screen.

The map style toggle was also a key choice to make given the several options available in other similar map apps. A whole bottom sheet felt too clumsy and a popup style toggle with a preview of different map style also felt cluttered.
Given the styles to cycle from are only 3 I went for the most minimal button toggle with no preview.
If the styles used were more, I would have gone for a bottom sheet with a preview of each style.

Mapbox also provides the option to customize the map style, but it wasn't a priority for the app at this time.

##Tab style

The first idea was to go super basic and go for a standard brand color background on focused, got to thank colonist mobile for the inspiration on the current style with the raised circled icon. 

##Scan

Kept it super minimal, a pulse animation felt annoying while testing so went for the common pattern of rounded corners , no overlay within the focus area and minimal amount of icons in the UI (arguably didn't even need to include the flip camera icon as it is such an unlikely scenario to happen).

## Packages

3 Options for the packages screen:
1.grid view
2.list view
3.cards view

## Settings

Mostly for UI preferences, stored locally via MMKV.


#History

Rough draft with no deps of what the history screen will look like.

#Theming

Dark mode is the default, but the user can change it in the settings screen.
Map style doesn't depend on the theme, default is also dark.



