export async function GET() {
  const tasks = [
    {
      id: 1,
      title: 'Design Homepage Mockup',
      description: 'Create wireframes and design for new homepage layout',
      dueDate: '2024-12-15T17:00:00',
      priority: 'high',
      project: 'Website Redesign',
      completed: false,
      tags: ['Design', 'UI/UX'],
      createdAt: '2024-12-10T09:00:00'
    },
    // Add more tasks as needed
  ];

  return new Response(JSON.stringify(tasks), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}