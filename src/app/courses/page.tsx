import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BookOpen, Clock, Users, Search, ArrowRight } from 'lucide-react'

// Mock data - will be replaced with API calls
const courses = [
  {
    id: '1',
    name: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming with practical examples and exercises.',
    thumbnail: null,
    category: 'Technology',
    lessonsCount: 12,
    flashcardsCount: 48,
    testsCount: 6,
    estimatedHours: 8,
    studentsCount: 1250,
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    description: 'Master advanced mathematical concepts from calculus to linear algebra.',
    thumbnail: null,
    category: 'Mathematics',
    lessonsCount: 20,
    flashcardsCount: 100,
    testsCount: 10,
    estimatedHours: 15,
    studentsCount: 890,
  },
  {
    id: '3',
    name: 'Business English',
    description: 'Improve your professional English skills for the workplace.',
    thumbnail: null,
    category: 'Language',
    lessonsCount: 15,
    flashcardsCount: 200,
    testsCount: 8,
    estimatedHours: 12,
    studentsCount: 2100,
  },
  {
    id: '4',
    name: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and machine learning basics.',
    thumbnail: null,
    category: 'Technology',
    lessonsCount: 18,
    flashcardsCount: 75,
    testsCount: 9,
    estimatedHours: 14,
    studentsCount: 1580,
  },
  {
    id: '5',
    name: 'World History',
    description: 'Explore key events and civilizations that shaped our world.',
    thumbnail: null,
    category: 'History',
    lessonsCount: 25,
    flashcardsCount: 150,
    testsCount: 12,
    estimatedHours: 18,
    studentsCount: 650,
  },
  {
    id: '6',
    name: 'Biology 101',
    description: 'Discover the building blocks of life from cells to ecosystems.',
    thumbnail: null,
    category: 'Science',
    lessonsCount: 16,
    flashcardsCount: 120,
    testsCount: 8,
    estimatedHours: 10,
    studentsCount: 920,
  },
]

const categories = ['All', 'Technology', 'Mathematics', 'Language', 'History', 'Science']

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/50 py-12">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Course Catalog
              </h1>
              <p className="mt-4 text-muted-foreground">
                Browse our collection of courses and find the perfect one to
                advance your knowledge.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === 'All' ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>

                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessonsCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.estimatedHours}h
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Users className="h-4 w-4" />
                      {course.studentsCount.toLocaleString()} students
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link href="/access" className="w-full">
                      <Button className="w-full">
                        Access Course
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold">Have an Access Code?</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your unique code to unlock your course content
            </p>
            <Link href="/access">
              <Button size="lg" className="mt-4">
                Enter Access Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
