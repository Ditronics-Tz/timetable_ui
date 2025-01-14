interface StatsCardProps {
    title: string
    count: number
  }
  
  export function StatsCard({ title, count }: StatsCardProps) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <p className="text-4xl font-bold text-indigo-600">{count}</p>
      </div>
    )
  }
  
  