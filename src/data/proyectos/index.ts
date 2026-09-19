import type { Proyecto } from '../../types/proyecto';

const modules = import.meta.glob<{ default: Proyecto }>('./*.json', { eager: true });

function isProyecto(value: unknown): value is Proyecto {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === 'string' &&
    Array.isArray(v.images) &&
    v.images.every((i) => typeof i === 'string')
  );
}

export const proyectos: Proyecto[] = Object.values(modules)
  .map((m) => m.default)
  .filter(isProyecto)
  .sort((a, b) => a.title.localeCompare(b.title, 'ca'));
