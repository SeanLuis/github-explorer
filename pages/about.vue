<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <section class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">About</h1>
      <p class="text-lg text-muted-foreground">
        Learn more about the GitHub Open Source Explorer project
      </p>
    </section>

    <Card>
      <CardHeader>
        <CardTitle>GitHub Open Source Explorer</CardTitle>
        <CardDescription>
          A modern interface for discovering open source projects on GitHub
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <p>
          This project aims to help developers discover interesting open source projects
          on GitHub through an intuitive and modern interface. Built with Nuxt.js and
          shadcn-ui, it provides a seamless experience for exploring repositories,
          topics, and curated collections.
        </p>

        <h3 class="text-lg font-semibold">Features</h3>
        <ul class="list-disc list-inside space-y-2">
          <li>Search repositories with advanced filters</li>
          <li>Explore trending topics and technologies</li>
          <li>Browse curated collections of related projects</li>
          <li>Modern and responsive interface</li>
          <li>Dark mode support</li>
        </ul>

        <h3 class="text-lg font-semibold">Technology Stack</h3>
        <div class="flex flex-wrap gap-2">
          <Badge variant="secondary">Nuxt.js</Badge>
          <Badge variant="secondary">Vue 3</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">shadcn-ui</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          as="a"
          href="https://github.com/yourusername/github-open-source"
          target="_blank"
          class="gap-2"
        >
          <Icon name="octicon:mark-github-16" class="h-4 w-4" />
          View on GitHub
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
