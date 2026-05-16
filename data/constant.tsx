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






export const HtmlWrapper = (THEMES: any, htmlCode: string) => {
    
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<script src="https://cdn.tailwindcss.com"></script>

<link
rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

<style>

${themeToCssVars(THEMES)}

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:var(--background);
color:var(--foreground);
font-family:Arial, sans-serif;
min-height:100vh;
padding:20px;
}

.card{
background:var(--card);
border:1px solid var(--border);
border-radius:24px;
padding:20px;
box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

button{
background:var(--primary);
color:white;
border:none;
padding:12px 18px;
border-radius:14px;
cursor:pointer;
font-weight:600;
}

input{
background:white;
border:1px solid var(--border);
padding:12px;
border-radius:12px;
width:100%;
}

.gradient-bg{
background: linear-gradient(
135deg,
var(--primary),
#9333ea
);
}

</style>

</head>

<body>

${htmlCode ?? ""}

</body>
</html>
`;
};