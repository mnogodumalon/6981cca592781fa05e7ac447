import { useState, useEffect, useMemo } from 'react';
import type { Trainingseinheiten, Koerpermessungen, Trainingsziele } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Scale, Flame, Trophy, Clock, Dumbbell, Calendar } from 'lucide-react';

// Intensity display labels
const INTENSITY_LABELS: Record<string, string> = {
  sehr_leicht: 'Sehr leicht',
  leicht: 'Leicht',
  mittel: 'Mittel',
  hoch: 'Hoch',
  sehr_hoch: 'Sehr hoch',
  maximal: 'Maximal',
};


const GOAL_CATEGORY_LABELS: Record<string, string> = {
  gewichtsabnahme: 'Gewichtsabnahme',
  muskelaufbau: 'Muskelaufbau',
  ausdauer: 'Ausdauer',
  kraft: 'Kraft',
  flexibilitaet: 'Flexibilität',
  allgemeine_fitness: 'Allgemeine Fitness',
  sonstiges: 'Sonstiges',
};

// Progress Ring Component
function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 8,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: progress >= 100 ? 'drop-shadow(0 0 6px hsl(var(--primary)))' : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// Loading skeleton for the dashboard
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Hero section */}
      <div className="flex flex-col items-center mb-8">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
        <Skeleton className="h-4 w-24 mt-4" />
      </div>

      {/* Quick stats */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-28 flex-shrink-0 rounded-lg" />
        ))}
      </div>

      {/* Chart */}
      <Skeleton className="h-[200px] w-full rounded-lg mb-8" />

      {/* Recent workouts */}
      <Skeleton className="h-6 w-32 mb-4" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg mb-3" />
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Dumbbell className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

// Add Training Form
function AddTrainingForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    trainingsdatum: format(new Date(), 'yyyy-MM-dd'),
    trainingsdauer: '',
    intensitaet: '',
    kalorien: '',
    stimmung: '',
    notizen_training: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const now = new Date();
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      await LivingAppsService.createTrainingseinheitenEntry({
        trainingsdatum: `${formData.trainingsdatum}T${timeString}`,
        trainingsdauer: formData.trainingsdauer ? Number(formData.trainingsdauer) : undefined,
        intensitaet: formData.intensitaet as Trainingseinheiten['fields']['intensitaet'],
        kalorien: formData.kalorien ? Number(formData.kalorien) : undefined,
        stimmung: formData.stimmung as Trainingseinheiten['fields']['stimmung'],
        notizen_training: formData.notizen_training || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create training:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trainingsdatum">Datum</Label>
        <Input
          id="trainingsdatum"
          type="date"
          value={formData.trainingsdatum}
          onChange={(e) => setFormData({ ...formData, trainingsdatum: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trainingsdauer">Dauer (Minuten)</Label>
          <Input
            id="trainingsdauer"
            type="number"
            placeholder="z.B. 45"
            value={formData.trainingsdauer}
            onChange={(e) => setFormData({ ...formData, trainingsdauer: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kalorien">Kalorien (kcal)</Label>
          <Input
            id="kalorien"
            type="number"
            placeholder="z.B. 350"
            value={formData.kalorien}
            onChange={(e) => setFormData({ ...formData, kalorien: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intensitaet">Intensität</Label>
        <Select
          value={formData.intensitaet || undefined}
          onValueChange={(value) => setFormData({ ...formData, intensitaet: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Intensität wählen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sehr_leicht">Sehr leicht</SelectItem>
            <SelectItem value="leicht">Leicht</SelectItem>
            <SelectItem value="mittel">Mittel</SelectItem>
            <SelectItem value="hoch">Hoch</SelectItem>
            <SelectItem value="sehr_hoch">Sehr hoch</SelectItem>
            <SelectItem value="maximal">Maximal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stimmung">Stimmung/Energielevel</Label>
        <Select
          value={formData.stimmung || undefined}
          onValueChange={(value) => setFormData({ ...formData, stimmung: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Stimmung wählen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sehr_schlecht">Sehr schlecht</SelectItem>
            <SelectItem value="schlecht">Schlecht</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="gut">Gut</SelectItem>
            <SelectItem value="sehr_gut">Sehr gut</SelectItem>
            <SelectItem value="ausgezeichnet">Ausgezeichnet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notizen">Notizen</Label>
        <Textarea
          id="notizen"
          placeholder="Wie war das Training?"
          value={formData.notizen_training}
          onChange={(e) => setFormData({ ...formData, notizen_training: e.target.value })}
          rows={3}
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Abbrechen
          </Button>
        </DialogClose>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Speichern...' : 'Training speichern'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function Dashboard() {
  const [trainingseinheiten, setTrainingseinheiten] = useState<Trainingseinheiten[]>([]);
  const [koerpermessungen, setKoerpermessungen] = useState<Koerpermessungen[]>([]);
  const [trainingsziele, setTrainingsziele] = useState<Trainingsziele[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [t, k, z] = await Promise.all([
        LivingAppsService.getTrainingseinheiten(),
        LivingAppsService.getKoerpermessungen(),
        LivingAppsService.getTrainingsziele(),
      ]);
      setTrainingseinheiten(t);
      setKoerpermessungen(k);
      setTrainingsziele(z);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fehler beim Laden der Daten'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Workouts this week
    const workoutsThisWeek = trainingseinheiten.filter((t) => {
      if (!t.fields.trainingsdatum) return false;
      const date = parseISO(t.fields.trainingsdatum);
      return isWithinInterval(date, { start: weekStart, end: weekEnd });
    });

    // Weekly goal (default 4)
    const weeklyGoal = 4;
    const workoutCount = workoutsThisWeek.length;
    const progressPercent = (workoutCount / weeklyGoal) * 100;

    // Latest weight
    const sortedMeasurements = [...koerpermessungen].sort((a, b) => {
      const dateA = a.fields.messdatum || a.createdat;
      const dateB = b.fields.messdatum || b.createdat;
      return dateB.localeCompare(dateA);
    });
    const latestWeight = sortedMeasurements[0]?.fields.gewicht;

    // Training streak
    let streak = 0;
    const sortedWorkouts = [...trainingseinheiten].sort((a, b) => {
      const dateA = a.fields.trainingsdatum || a.createdat;
      const dateB = b.fields.trainingsdatum || b.createdat;
      return dateB.localeCompare(dateA);
    });

    if (sortedWorkouts.length > 0) {
      const workoutDates = new Set(
        sortedWorkouts.map((w) => {
          const d = w.fields.trainingsdatum || w.createdat;
          return d.split('T')[0];
        })
      );

      let checkDate = new Date();
      // Check if today has workout, if not check yesterday
      let todayStr = format(checkDate, 'yyyy-MM-dd');
      if (!workoutDates.has(todayStr)) {
        checkDate = subDays(checkDate, 1);
        todayStr = format(checkDate, 'yyyy-MM-dd');
        if (!workoutDates.has(todayStr)) {
          streak = 0;
        } else {
          streak = 1;
          checkDate = subDays(checkDate, 1);
        }
      } else {
        streak = 1;
        checkDate = subDays(checkDate, 1);
      }

      if (streak > 0) {
        while (workoutDates.has(format(checkDate, 'yyyy-MM-dd'))) {
          streak++;
          checkDate = subDays(checkDate, 1);
        }
      }
    }

    // Calories this week
    const caloriesThisWeek = workoutsThisWeek.reduce(
      (sum, w) => sum + (w.fields.kalorien || 0),
      0
    );

    return {
      workoutCount,
      weeklyGoal,
      progressPercent,
      latestWeight,
      streak,
      caloriesThisWeek,
    };
  }, [trainingseinheiten, koerpermessungen]);

  // Weight chart data (last 30 days)
  const weightChartData = useMemo(() => {
    const last30Days = subDays(new Date(), 30);
    return koerpermessungen
      .filter((m) => {
        const date = m.fields.messdatum || m.createdat;
        return parseISO(date) >= last30Days && m.fields.gewicht != null;
      })
      .sort((a, b) => {
        const dateA = a.fields.messdatum || a.createdat;
        const dateB = b.fields.messdatum || b.createdat;
        return dateA.localeCompare(dateB);
      })
      .map((m) => ({
        date: format(parseISO(m.fields.messdatum || m.createdat), 'dd. MMM', { locale: de }),
        gewicht: m.fields.gewicht,
      }));
  }, [koerpermessungen]);

  // Recent workouts (last 5)
  const recentWorkouts = useMemo(() => {
    return [...trainingseinheiten]
      .sort((a, b) => {
        const dateA = a.fields.trainingsdatum || a.createdat;
        const dateB = b.fields.trainingsdatum || b.createdat;
        return dateB.localeCompare(dateA);
      })
      .slice(0, 5);
  }, [trainingseinheiten]);

  // Active goals
  const activeGoals = useMemo(() => {
    return trainingsziele
      .filter(
        (z) =>
          z.fields.aktueller_status === 'in_arbeit' ||
          z.fields.aktueller_status === 'nicht_begonnen'
      )
      .sort((a, b) => {
        const dateA = a.fields.zieldatum || '9999-12-31';
        const dateB = b.fields.zieldatum || '9999-12-31';
        return dateA.localeCompare(dateB);
      })
      .slice(0, 3);
  }, [trainingsziele]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4 w-fit mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Fehler beim Laden</h2>
            <p className="text-muted-foreground text-sm mb-4">{error.message}</p>
            <Button onClick={loadData}>Erneut versuchen</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const today = format(new Date(), 'EEEE, d. MMMM', { locale: de });

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-semibold">Fitness Tagebuch</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">{today}</span>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Training starten
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Neues Training</DialogTitle>
              </DialogHeader>
              <AddTrainingForm
                onSuccess={loadData}
                onClose={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 pb-0">
        <h1 className="text-xl font-semibold">Fitness Tagebuch</h1>
        <span className="text-sm text-muted-foreground">{today}</span>
      </header>

      <main className="p-4 md:p-6">
        {/* Desktop Layout: Two Columns */}
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Left Column (2/3) */}
          <div className="md:col-span-2 space-y-6">
            {/* Hero Section - Progress Ring */}
            <div className="flex flex-col items-center py-8 md:py-6">
              <ProgressRing progress={kpis.progressPercent} size={200} strokeWidth={8}>
                <span className="text-5xl font-bold">{kpis.workoutCount}</span>
                <span className="text-sm text-muted-foreground">
                  von {kpis.weeklyGoal} Trainings
                </span>
              </ProgressRing>
              <span className="text-sm text-muted-foreground mt-4">Diese Woche</span>
            </div>

            {/* Quick Stats Row (Mobile) */}
            <div className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex-shrink-0 bg-muted/50 rounded-lg p-4 min-w-[100px] flex flex-col items-center">
                <Scale className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-lg font-semibold">
                  {kpis.latestWeight ? `${kpis.latestWeight.toFixed(1)}` : '-'}
                </span>
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
              <div className="flex-shrink-0 bg-muted/50 rounded-lg p-4 min-w-[100px] flex flex-col items-center">
                <Trophy className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-lg font-semibold">{kpis.streak}</span>
                <span className="text-xs text-muted-foreground">Tage Streak</span>
              </div>
              <div className="flex-shrink-0 bg-muted/50 rounded-lg p-4 min-w-[100px] flex flex-col items-center">
                <Flame className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-lg font-semibold">{kpis.caloriesThisWeek}</span>
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
            </div>

            {/* Weight Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Gewichtsverlauf</CardTitle>
                <p className="text-xs text-muted-foreground">Letzte 30 Tage</p>
              </CardHeader>
              <CardContent>
                {weightChartData.length > 0 ? (
                  <div className="h-[180px] md:h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightChartData}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          domain={['dataMin - 1', 'dataMax + 1']}
                          tick={{ fontSize: 11 }}
                          stroke="hsl(var(--muted-foreground))"
                          tickLine={false}
                          axisLine={false}
                          width={35}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Gewicht']}
                        />
                        <Area
                          type="monotone"
                          dataKey="gewicht"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#weightGradient)"
                          dot={false}
                          activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    title="Keine Messungen"
                    description="Erfasse dein Gewicht um den Verlauf zu sehen."
                  />
                )}
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <div>
              <h2 className="text-base font-semibold mb-4">Letzte Trainings</h2>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                    <Card
                      key={workout.record_id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {workout.fields.trainingsdatum
                                  ? format(
                                      parseISO(workout.fields.trainingsdatum),
                                      'dd. MMM, HH:mm',
                                      { locale: de }
                                    )
                                  : format(parseISO(workout.createdat), 'dd. MMM, HH:mm', {
                                      locale: de,
                                    })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {workout.fields.trainingsdauer && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {workout.fields.trainingsdauer} min
                                </span>
                              )}
                              {workout.fields.kalorien && (
                                <span className="flex items-center gap-1">
                                  <Flame className="h-3 w-3" />
                                  {workout.fields.kalorien} kcal
                                </span>
                              )}
                            </div>
                          </div>
                          {workout.fields.intensitaet && (
                            <Badge
                              variant="secondary"
                              className={
                                workout.fields.intensitaet === 'hoch' ||
                                workout.fields.intensitaet === 'sehr_hoch' ||
                                workout.fields.intensitaet === 'maximal'
                                  ? 'bg-primary/10 text-primary'
                                  : ''
                              }
                            >
                              {INTENSITY_LABELS[workout.fields.intensitaet] ||
                                workout.fields.intensitaet}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <EmptyState
                      title="Noch keine Trainings"
                      description="Starte dein erstes Training und tracke deinen Fortschritt!"
                      action={
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Erstes Training starten
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Neues Training</DialogTitle>
                            </DialogHeader>
                            <AddTrainingForm
                              onSuccess={loadData}
                              onClose={() => setDialogOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                      }
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column (1/3) - Desktop Only */}
          <div className="hidden md:block space-y-6">
            {/* Quick Stats Cards */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aktuelles Gewicht</p>
                      <p className="text-2xl font-semibold">
                        {kpis.latestWeight ? `${kpis.latestWeight.toFixed(1)} kg` : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Training Streak</p>
                      <p className="text-2xl font-semibold">{kpis.streak} Tage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <Flame className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kalorien diese Woche</p>
                      <p className="text-2xl font-semibold">{kpis.caloriesThisWeek} kcal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Aktive Ziele</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.record_id}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {goal.fields.zielbezeichnung || 'Unbenanntes Ziel'}
                          </p>
                          {goal.fields.zielkategorie && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {GOAL_CATEGORY_LABELS[goal.fields.zielkategorie] ||
                                goal.fields.zielkategorie}
                            </Badge>
                          )}
                        </div>
                        {goal.fields.zieldatum && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            bis{' '}
                            {format(parseISO(goal.fields.zieldatum), 'dd.MM.yy', {
                              locale: de,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 text-base">
              <Plus className="h-5 w-5 mr-2" />
              Training starten
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neues Training</DialogTitle>
            </DialogHeader>
            <AddTrainingForm
              onSuccess={loadData}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Spacer for mobile fixed button */}
      <div className="md:hidden h-24" />
    </div>
  );
}
