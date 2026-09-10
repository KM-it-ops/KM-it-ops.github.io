/* Live-copy patch until the next Vite rebuild. Keeps recruiter-facing text aligned with the junior-analyst resume. */
(function () {
  const swaps = [
    ['Tier-1 SOC · Junior detection · Security automation', 'Junior Security Analyst · Operations · IT Risk'],
    ['Tier-1 SOC / Jr Detection / Security Automation', 'Junior Security Analyst / Security Operations / IT Risk'],
    ['Public automation first. Client delivery included.', 'Detection, phishing classifier, vuln workflow — then tooling.'],
    ['Tier-1 SOC, junior detection, or security automation — triage and clear tickets first.', 'Junior security analyst, security operations, VM, or IT risk — triage and document first.'],
    ['Habits from regulated ops, Security+, a 3.96 Summa finish, and public automation you can open and review.', 'Regulated-ops habits, Security+, a 3.96 Summa finish, and public detection / VM projects you can run.'],
    ['Michael Kurdi CV', 'Resume'],
  ];

  function patchText(value) {
    let next = value;
    for (const [from, to] of swaps) {
      if (next.includes(from)) next = next.split(from).join(to);
    }
    return next;
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const next = patchText(node.nodeValue || '');
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (
        href.includes('Michael_Kurdi_Resume') ||
        href.includes('Resume_SOC_onepager')
      ) {
        node.setAttribute('href', '/resume.html');
      }
    }
    const kids = node.childNodes;
    for (let i = 0; i < kids.length; i++) walk(kids[i]);
  }

  function run() {
    walk(document.body);
  }

  run();
  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
