<template>
  <div class="space-y-8">
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="relative">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          About the Project
        </h1>
        <p class="text-lg text-muted-foreground mx-auto max-w-2xl">
          Learn more about GitHub Open Source Explorer and the technology behind it
        </p>
      </div>
    </section>

    <div class="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="space-y-1 p-6">
          <CardTitle class="text-2xl">GitHub Open Source Explorer</CardTitle>
          <CardDescription>
            A modern interface for discovering and exploring open source projects
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-8">
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Overview</h3>
            <p class="text-muted-foreground">
              This project aims to revolutionize how developers discover and interact with open source projects on GitHub. 
              Built with modern technologies and focused on user experience, it provides powerful search capabilities
              and curated collections to help you find the perfect tools for your next project.
            </p>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Key Features</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle class="text-base flex items-center gap-2">
                    <Icon name="octicon:search-16" class="h-5 w-5 text-primary" />
                    Smart Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">
                    Advanced search capabilities with filters for language, stars, and more
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle class="text-base flex items-center gap-2">
                    <Icon name="octicon:project-roadmap-16" class="h-5 w-5 text-primary" />
                    Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">
                    Curated sets of repositories organized by purpose and technology
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle class="text-base flex items-center gap-2">
                    <Icon name="octicon:hash-16" class="h-5 w-5 text-primary" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">
                    Explore repositories through GitHub's topic system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle class="text-base flex items-center gap-2">
                    <Icon name="octicon:device-desktop-16" class="h-5 w-5 text-primary" />
                    Modern UI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">
                    Responsive design with dark mode support
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Technology Stack</h3>
            <div class="flex flex-wrap gap-2">
              <Badge variant="secondary" class="flex items-center gap-1">
                <Icon name="logos:nuxt-icon" class="h-4 w-4" />
                Nuxt.js
              </Badge>
              <Badge variant="secondary" class="flex items-center gap-1">
                <Icon name="logos:vue" class="h-4 w-4" />
                Vue 3
              </Badge>
              <Badge variant="secondary" class="flex items-center gap-1">
                <Icon name="logos:typescript-icon" class="h-4 w-4" />
                TypeScript
              </Badge>
              <Badge variant="secondary" class="flex items-center gap-1">
                <Icon name="logos:tailwindcss-icon" class="h-4 w-4" />
                Tailwind CSS
              </Badge>
              <Badge variant="secondary" class="flex items-center gap-1">
                <Icon name="radix-icons:shadow" class="h-4 w-4" />
                shadcn-vue
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button
            variant="outline"
            as="a"
            href="https://github.com/yourusername/github-open-source"
            target="_blank"
            class="gap-2"
          >
            <Icon name="octicon:mark-github-16" class="h-4 w-4" />
            View Source
          </Button>
          <Button
            variant="default"
            as="a"
            href="https://github.com/yourusername"
            target="_blank"
            class="gap-2"
          >
            <Icon name="octicon:person-16" class="h-4 w-4" />
            Follow Developer
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Add Schema.org data for about page
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: 'About - GitHub Open Source Explorer',
    description: 'Learn more about GitHub Open Source Explorer and the technology behind it',
    mainEntity: {
      '@type': 'WebSite',
      name: 'GitHub Open Source Explorer',
      description: 'A modern interface for discovering and exploring open source projects',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  })
])
</script>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
