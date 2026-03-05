/**
 * Geração de IDs únicos para entidades em memória
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
