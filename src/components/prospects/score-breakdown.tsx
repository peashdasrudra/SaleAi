import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ScoreFactor {
  factor: string;
  points: number;
  explanation: string;
}

interface ScoreBreakdownProps {
  breakdown: ScoreFactor[];
  totalScore: number;
  priority: string;
}

export function ScoreBreakdown({ breakdown, totalScore, priority }: ScoreBreakdownProps) {
  const priorityColor = 
    priority === 'URGENT' ? 'bg-red-500' :
    priority === 'HIGH' ? 'bg-orange-500' :
    priority === 'MEDIUM' ? 'bg-blue-500' : 'bg-gray-500';

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Score Breakdown</CardTitle>
          <Badge className={`${priorityColor} text-white border-none`}>{priority}</Badge>
        </div>
        <div className="text-3xl font-bold">{totalScore}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.factor}</span>
                <span className={item.points >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {item.points >= 0 ? '+' : ''}{item.points}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.explanation}</p>
              <Progress 
                value={Math.abs(item.points)} 
                max={50} 
                className={`h-1.5 ${item.points >= 0 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
