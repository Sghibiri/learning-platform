import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, ClipboardCheck, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Learn Smarter,{' '}
                <span className="text-primary">Not Harder</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Access interactive courses, flashcards, and tests designed to help
                you master any subject. Enter your access code to start learning
                today.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/access">
                  <Button size="lg" className="w-full sm:w-auto">
                    Enter Access Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.100),transparent)] opacity-20" />
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to Succeed
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our platform combines multiple learning tools to help you retain
                information and excel in your studies.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Rich Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Access comprehensive course materials with text, images, and
                    embedded videos for every topic.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <Brain className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Flashcards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Interactive flashcards with smooth flip animations to help you
                    memorize key concepts effectively.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <ClipboardCheck className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Practice Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Timed tests with multiple question types to prepare you for
                    exams and track your progress.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <Sparkles className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Interactive</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Engaging interface designed to make learning enjoyable and
                    keep you motivated throughout.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Start Learning?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Enter your access code to unlock your course content and begin
                your learning journey today.
              </p>
              <div className="mt-8">
                <Link href="/access">
                  <Button size="lg">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
