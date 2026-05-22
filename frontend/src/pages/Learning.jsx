import React, { useEffect, useState, useMemo } from 'react'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { learningService } from '@/services/api'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import {
  Building2, Car, Crown, Coins, GraduationCap, Clock,
  Trophy, BookOpen, AlertCircle, CheckCircle2, Play
} from 'lucide-react'
import { cn } from '@/utils/cn'

export const Learning = () => {
  const { user, learning, completeLesson } = useAssetifyStore()
  const { toast } = useToastStore()

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedLesson, setSelectedLesson] = useState(null)
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0)
  const [lessonFinished, setLessonFinished] = useState(false)
  const [modules, setModules] = useState([])

  useEffect(() => {
    learningService.getModules()
      .then((response) => setModules(response.modules || []))
      .catch((error) => toast({ title: 'Academy Load Failed', description: error.message, type: 'error' }))
  }, [toast])

  // Filter modules
  const filteredModules = useMemo(() => {
    if (activeCategory === 'all') return modules
    return modules.filter((m) => m.category === activeCategory)
  }, [activeCategory, modules])

  const categoryIcons = {
    'real-estate': <Building2 size={14} />,
    'automobile': <Car size={14} />,
    'luxury': <Crown size={14} />,
    'gold': <Coins size={14} />
  }

  const categoryTabOptions = [
    { id: 'all', label: 'All Modules' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'automobile', label: 'Auto' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'gold', label: 'Gold' }
  ]

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setQuizSubmitted(false)
    setWrongAnswersCount(0)
    setLessonFinished(false)
  }

  const handleOptionSelect = (idx) => {
    if (quizSubmitted) return
    setSelectedOption(idx)
  }

  const handleQuizSubmit = () => {
    if (selectedOption === null || quizSubmitted) return
    setQuizSubmitted(true)
    
    const isCorrect = selectedOption === selectedLesson.quiz[currentQuestionIndex].correctIndex
    if (!isCorrect) {
      setWrongAnswersCount((prev) => prev + 1)
    }
  }

  const handleNextQuestion = async () => {
    setSelectedOption(null)
    setQuizSubmitted(false)
    
    if (currentQuestionIndex + 1 < selectedLesson.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Quiz complete!
      const xpMultiplier = Math.max(0.5, 1 - (wrongAnswersCount * 0.2)) // loose XP for wrong tries
      const earnedXP = Math.round(selectedLesson.xpReward * xpMultiplier)
      
      const isAlreadyCompleted = learning.completedLessons.includes(selectedLesson.id)
      
      // Save state
      try {
        await completeLesson('academy', selectedLesson.id, earnedXP)
        setLessonFinished(true)
        toast({
          title: isAlreadyCompleted ? 'Lesson Reviewed' : 'Lesson Mastered!',
          description: `Your lesson progress was saved to the database.`,
          type: 'gold'
        })
      } catch (error) {
        toast({
          title: 'Progress Save Failed',
          description: error.message,
          type: 'error'
        })
      }
    }
  }

  const activeQuestion = selectedLesson?.quiz[currentQuestionIndex]
  const isOptionCorrect = selectedOption === activeQuestion?.correctIndex

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Academy Overview Banner */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Assetify Academy</h2>
            <p className="text-[10px] text-text-muted">Master asset management through micro-learning. Unlock certifications.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-border px-3.5 py-1.5 rounded-xl">
          <Clock size={13} className="text-text-muted" />
          <span className="text-[10px] text-text-secondary font-semibold">
            {learning.completedLessons.length} of {modules.reduce((sum, c) => sum + c.lessons.length, 0)} completed
          </span>
        </div>
      </GlassCard>

      {/* Tabs list filter */}
      <Tabs
        options={categoryTabOptions}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        className="w-full sm:w-auto"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Course Catalog */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {filteredModules.map((module) => (
            <GlassCard key={module.id} className="p-6 flex flex-col gap-4" hoverEffect={false}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border text-text-primary">
                    {categoryIcons[module.category] || <GraduationCap size={15} />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-text-primary tracking-wide">{module.title}</h3>
                    <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                      Module Code: {module.id}
                    </span>
                  </div>
                </div>
                <Badge variant={module.category === 'real-estate' ? 'emerald' : module.category === 'luxury' ? 'gold' : module.category === 'automobile' ? 'blue' : 'gray'}>
                  {module.category}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{module.description}</p>

              {/* Lesson Items */}
              <div className="flex flex-col gap-2 mt-2">
                {module.lessons.map((lesson) => {
                  const isCompleted = learning.completedLessons.includes(lesson.id)
                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        'flex items-center justify-between p-3.5 rounded-xl border border-border/80 transition-colors',
                        isCompleted ? 'bg-luxury-emerald/5 border-luxury-emerald/15' : 'bg-surface-elevated/25 hover:bg-surface-elevated/45'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-1.5 rounded-lg border',
                          isCompleted ? 'bg-luxury-emerald/15 text-text-emerald border-luxury-emerald/25' : 'bg-surface text-text-muted border-border'
                        )}>
                          <CheckCircle2 size={13} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-text-primary">{lesson.title}</span>
                          <span className="text-[10px] text-text-muted">{lesson.duration} | {lesson.xpReward} XP Reward</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isCompleted ? 'secondary' : 'primary'}
                        onClick={() => handleStartLesson(lesson)}
                        className="gap-1 flex"
                      >
                        <Play size={10} /> {isCompleted ? 'Review' : 'Unlock'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Lesson Quiz Player Container */}
        <div className="lg:col-span-1">
          {selectedLesson ? (
            <GlassCard glowColor="emerald" className="p-6 flex flex-col gap-5 min-h-[350px]" hoverEffect={false}>
              
              {/* Header */}
              <div className="flex justify-between items-center select-none">
                <span className="text-[9px] text-text-emerald font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <GraduationCap size={12} /> CLASS PLAYROOM
                </span>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-text-muted hover:text-text-primary text-[10px] font-bold uppercase cursor-pointer"
                >
                  Terminate
                </button>
              </div>

              {!lessonFinished ? (
                <>
                  {/* Lesson detail context */}
                  <div className="flex flex-col gap-1.5 select-none">
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide leading-relaxed font-outfit">
                      {selectedLesson.title}
                    </h3>
                    <p className="text-[10px] text-text-secondary leading-relaxed bg-surface-elevated/45 border border-border p-3 rounded-xl">
                      {selectedLesson.description}
                    </p>
                  </div>

                  {/* Question setup */}
                  <div className="flex flex-col gap-3 select-none">
                    <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">
                      Evaluation {currentQuestionIndex + 1} of {selectedLesson.quiz.length}
                    </span>
                    <h4 className="text-xs font-bold text-text-primary leading-normal">
                      {activeQuestion.question}
                    </h4>

                    {/* Options list */}
                    <div className="flex flex-col gap-2">
                      {activeQuestion.options.map((opt, oIdx) => {
                        const isSelected = selectedOption === oIdx
                        const isOptionCorrectAnswer = activeQuestion.correctIndex === oIdx
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleOptionSelect(oIdx)}
                            className={cn(
                              'p-3 rounded-xl text-left text-xs font-medium cursor-pointer border select-none transition-all leading-normal',
                              isSelected
                                ? quizSubmitted
                                  ? isOptionCorrect
                                    ? 'bg-luxury-emerald/10 border-luxury-emerald text-text-emerald'
                                    : 'bg-red-500/10 border-red-500 text-red-400'
                                  : 'bg-luxury-emerald/5 border-luxury-emerald/40 text-text-primary'
                                : quizSubmitted && isOptionCorrectAnswer
                                  ? 'bg-luxury-emerald/10 border-luxury-emerald text-text-emerald'
                                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40'
                            )}
                          >
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quiz actions */}
                  <div className="mt-2">
                    {!quizSubmitted ? (
                      <Button
                        className="w-full"
                        disabled={selectedOption === null}
                        onClick={handleQuizSubmit}
                      >
                        Submit Response
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className={cn(
                          'p-3 rounded-xl border flex gap-2 select-none text-left',
                          isOptionCorrect ? 'bg-luxury-emerald/5 border-luxury-emerald/30 text-text-emerald' : 'bg-red-500/5 border-red-500/30 text-red-400'
                        )}>
                          <AlertCircle size={15} className="shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {isOptionCorrect ? 'Correct!' : 'Incorrect'}
                            </span>
                            <span className="text-[10px] text-text-secondary leading-relaxed">
                              {activeQuestion.explanation}
                            </span>
                          </div>
                        </div>

                        <Button className="w-full" onClick={handleNextQuestion}>
                          {currentQuestionIndex + 1 < selectedLesson.quiz.length ? 'Next Question' : 'Conclude Lesson'}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8 select-none">
                  <div className="h-14 w-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 text-luxury-gold flex items-center justify-center animate-bounce">
                    <Trophy size={26} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-text-primary font-outfit uppercase">Evaluate Completed</h3>
                    <p className="text-[10px] text-text-muted leading-relaxed max-w-[200px]">
                      Lesson parameters established. Verification rewards successfully linked to user ledger.
                    </p>
                  </div>
                  <Button onClick={() => setSelectedLesson(null)} className="w-full max-w-[180px] mt-2">
                    Conclude Panel
                  </Button>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="p-6 text-center flex flex-col items-center justify-center min-h-[350px] text-text-muted" hoverEffect={false}>
              <BookOpen size={24} className="text-border mb-2" />
              <span className="text-xs font-bold">No lesson loaded</span>
              <span className="text-[10px] text-text-muted mt-1 leading-normal max-w-[200px] select-none">
                Select an Academy module on the left side to unlock its micro-lessons.
              </span>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
export default Learning
