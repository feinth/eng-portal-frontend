<template>
  <div class="markdown-view" v-html="compiledMarkdown"></div>
</template>

<script>
import { marked } from 'marked'

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    compiledMarkdown() {
      if (!this.content) return ''
      
      try {
        // Поддержка разных версий marked
        if (typeof marked.parse === 'function') {
          return marked.parse(this.content)
        }
        return marked(this.content)
      } catch (e) {
        // Если что-то пошло не так — выводим как есть
        return this.content
      }
    }
  }
}
</script>

<style scoped>
.markdown-view :deep(a) {
  color: var(--q-primary);
  font-weight: 600;
  text-decoration: none;
}

.markdown-view :deep(a:hover) {
  text-decoration: underline;
}

.markdown-view :deep(strong) {
  font-weight: 700;
  color: #2B2D42;
}

.markdown-view :deep(p) {
  margin-bottom: 0.75rem;
}

.markdown-view :deep(p:last-child) {
  margin-bottom: 0;
}
</style>