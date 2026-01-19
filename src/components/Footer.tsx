export function Footer() {
  return (
    <footer className="border-t border-gray-300 py-6 text-center text-sm text-gray-600">
      <p>
        Made by{" "}
        <a href="https://dldc.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          etienne.tech
        </a>{" "}
        - Code available on{" "}
        <a
          href="https://github.com/etienne-dldc/cidr-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Github
        </a>
      </p>
    </footer>
  );
}
