const clients = new Set();

export const subscribeToCatalogUpdates = (req, res) => {
  res.status(200).set({
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });
  res.flushHeaders?.();
  res.write('retry: 3000\n\n');

  clients.add(res);
  const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 25000);

  req.on('close', () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
};

export const publishCatalogUpdate = (type) => {
  const payload = JSON.stringify({ type, updatedAt: Date.now() });
  for (const client of clients) {
    client.write(`event: catalog-update\ndata: ${payload}\n\n`);
  }
};
