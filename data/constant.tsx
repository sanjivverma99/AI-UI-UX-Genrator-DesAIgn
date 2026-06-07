import { themeToCssVars } from "./Themes";

 
 export const suggestion = [
    {
        icon:'✈️',
        name:'Travel Planner App',
        description:'Trip Planning dasboard with maps,itineraies, and booking cards. clean modern layout with soft colors.'
    },
    {
        icon:'📚',
        name:'AI Learning platform',
        description:'Gamified learning experience with progress step and streaks.Friendly,engaging, and colorful UI.'
    },
    {
       icon:'💳',
        name:'Finance Tracker',
        description:'Expense tracking dashboard with charts and budget goals. Minimal UI with dark mode support.'
    },
    {
        icon:'🛒',
        name:'E-Commerce Store',
        description:'Product browsing and checkout experience. Premiun UI with strong call-to-action design.'
    },
    {
        icon:'📅',
        name:'Smart To-DO Planner',
        description:'Task management with calendar and priority views. Simple productivity-focused interface.'
    },
    {
        icon:'🍔',
        name:'Food Delivery App',
        description:'Restaurant Listings and fast ordering flow. Bright visuals with large food images.'
    },
    {
         icon:'👶',
        name:'Kid Lerning App',
        description:'Interactive learning app for kids  with rewards. Colorful UI and Playful illustrations.'
    }
]






export const HtmlWrapper = (THEMES: any, htmlCode: string,selectedTheme:string) => {
    

const theme=THEMES[selectedTheme];

return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>

<script src="https://cdn.tailwindcss.com"></script>

<style>

:root{
--primary:${theme?.primary || "#6366f1"};
--secondary:${theme?.secondary || "#ec4899"};
--background:${theme?.background || "#ffffff"};
}

body{
margin:0;
padding:16px;
background:var(--background);
font-family:Inter,sans-serif;
}

button{
background:var(--primary)!important;
color:white!important;
}

.card{
border-radius:16px;
padding:16px;
background:linear-gradient(
135deg,
var(--primary),
var(--secondary)
);
color:white;
}

</style>

</head>

<body>

${htmlCode}

</body>

</html>
`;
};