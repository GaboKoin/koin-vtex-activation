/**
 * Lee un literal objeto JS tras `const Name = ` respetando strings y template literals.
 */
export function extractConstObject(html, name) {
  const prefix = `const ${name} = `;
  const start = html.indexOf(prefix);
  if (start === -1) {
    throw new Error(`No se encontró ${name} en el HTML`);
  }
  let i = start + prefix.length;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== '{') {
    throw new Error(`Se esperaba { tras ${name}`);
  }
  const open = i;
  let depth = 0;
  let inTick = false;
  let tickEsc = false;
  let inSingle = false;
  let inDouble = false;
  let strEsc = false;

  for (let k = open; k < html.length; k++) {
    const c = html[k];
    if (inTick) {
      if (tickEsc) {
        tickEsc = false;
        continue;
      }
      if (c === '\\') {
        tickEsc = true;
        continue;
      }
      if (c === '`') {
        inTick = false;
      }
      continue;
    }
    if (inSingle) {
      if (strEsc) {
        strEsc = false;
        continue;
      }
      if (c === '\\') {
        strEsc = true;
        continue;
      }
      if (c === "'") {
        inSingle = false;
      }
      continue;
    }
    if (inDouble) {
      if (strEsc) {
        strEsc = false;
        continue;
      }
      if (c === '\\') {
        strEsc = true;
        continue;
      }
      if (c === '"') {
        inDouble = false;
      }
      continue;
    }
    if (c === '`') {
      inTick = true;
      continue;
    }
    if (c === "'") {
      inSingle = true;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) {
        const literal = html.slice(open, k + 1);
        // eslint-disable-next-line no-new-func
        return new Function(`return ${literal}`)();
      }
    }
  }
  throw new Error(`Literal ${name} sin cerrar`);
}

export function parseChatbotHtml(html) {
  const STEPS_PROGRESS = extractConstObject(html, 'STEPS_PROGRESS');
  const KB = extractConstObject(html, 'KB');
  return { STEPS_PROGRESS, KB };
}
