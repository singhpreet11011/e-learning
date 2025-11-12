const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create a sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to intermediate level.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      isPublished: true,
      chapters: {
        create: [
          {
            title: 'Getting Started with HTML',
            description: 'Learn the basics of HTML and structure of web pages',
            position: 1,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'Introduction to HTML',
                  description: 'Understanding what HTML is and why it matters',
                  content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically and originally included cues for the appearance of the document.

## What is HTML?

HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects such as interactive forms may be embedded into the rendered page.

## Key Concepts:
- Elements and Tags
- Attributes
- Document Structure
- Semantic HTML

## Why Learn HTML?

HTML is the foundation of all web development. Every web page you see is built with HTML at its core.`,
                  position: 1,
                  videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
                  duration: 15,
                  isPublished: true,
                  courseId: '', // Will be set below
                  questions: {
                    create: [
                      {
                        question: 'What does HTML stand for?',
                        position: 1,
                        options: {
                          create: [
                            {
                              text: 'Hyper Text Markup Language',
                              isCorrect: true,
                              position: 1,
                            },
                            {
                              text: 'High Tech Modern Language',
                              isCorrect: false,
                              position: 2,
                            },
                            {
                              text: 'Home Tool Markup Language',
                              isCorrect: false,
                              position: 3,
                            },
                            {
                              text: 'Hyperlinks and Text Markup Language',
                              isCorrect: false,
                              position: 4,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  title: 'HTML Elements and Tags',
                  description: 'Deep dive into HTML elements, tags, and attributes',
                  content: `HTML elements are defined by tags, which are keywords surrounded by angle brackets.

## Basic Structure

\`\`\`html
<tagname>Content goes here...</tagname>
\`\`\`

## Common HTML Elements:
- **Headings**: h1, h2, h3, h4, h5, h6
- **Paragraph**: p
- **Links**: a
- **Images**: img
- **Lists**: ul, ol, li
- **Divisions**: div
- **Spans**: span`,
                  position: 2,
                  videoUrl: 'https://www.youtube.com/watch?v=rspRmQn0KJU',
                  duration: 20,
                  isPublished: true,
                  courseId: '', // Will be set below
                },
              ],
            },
          },
          {
            title: 'Styling with CSS',
            description: 'Learn how to style your web pages with CSS',
            position: 2,
            isPublished: true,
            lessons: {
              create: [
                {
                  title: 'Introduction to CSS',
                  description: 'Understanding CSS and its role in web design',
                  content: `CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML or XML.

## What is CSS?

CSS describes how elements should be rendered on screen, on paper, in speech, or on other media.

## Key Features:
- Separation of content and presentation
- Cascading and inheritance
- Responsive design capabilities
- Animations and transitions`,
                  position: 1,
                  videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
                  duration: 25,
                  isPublished: true,
                  courseId: '', // Will be set below
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Update the courseId for all lessons
  await prisma.lesson.updateMany({
    where: {
      courseId: '',
    },
    data: {
      courseId: course.id,
    },
  });

  // Create another sample course
  const course2 = await prisma.course.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming and start building interactive web applications.',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Variables and Data Types',
            description: 'Learn about JavaScript variables and different data types',
            content: `JavaScript variables are containers for storing data values.

## Declaring Variables

In JavaScript, you can declare variables using:
- \`var\` (function-scoped)
- \`let\` (block-scoped)
- \`const\` (block-scoped, constant)

## Data Types

JavaScript has several data types:
- **Primitive Types**: String, Number, Boolean, Undefined, Null, Symbol, BigInt
- **Reference Types**: Object, Array, Function`,
            position: 1,
            videoUrl: 'https://www.youtube.com/watch?v=edBx-fjgh4k',
            duration: 30,
            isPublished: true,
            questions: {
              create: [
                {
                  question: 'Which keyword is used to declare a constant in JavaScript?',
                  position: 1,
                  options: {
                    create: [
                      {
                        text: 'const',
                        isCorrect: true,
                        position: 1,
                      },
                      {
                        text: 'var',
                        isCorrect: false,
                        position: 2,
                      },
                      {
                        text: 'let',
                        isCorrect: false,
                        position: 3,
                      },
                      {
                        text: 'constant',
                        isCorrect: false,
                        position: 4,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
  console.log(`Created courses: ${course.title}, ${course2.title}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
