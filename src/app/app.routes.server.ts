import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'updatehouse/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'chat/:userId',
    renderMode: RenderMode.Server
  },
  {
    path: 'houses/:id',
    renderMode: RenderMode.Server // Changed to Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

export function getPrerenderParams(request: Request) {
  // Define all possible parameter values for dynamic routes
  const updateHouseIds = [1, 2, 3]; // Replace with actual house IDs
  const chatUserIds = [1, 2, 3]; // Replace with actual user IDs
  const houseIds = [101, 102, 103]; // Replace with actual house IDs

  const routes = [
    ...updateHouseIds.map(id => ({ route: `updatehouse/${id}` })),
    ...chatUserIds.map(userId => ({ route: `chat/${userId}` })),
    ...houseIds.map(id => ({ route: `houses/${id}` })) // Ensure this is included
  ];

  return routes;
}
