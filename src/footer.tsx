/*
This file sets up the footer for the website. The core styling was adopted from a bootstrap template
credited here: https://getbootstrap.com/docs/4.0/examples/cover/
*/

export default function Footer() {
  return (
    <div>
      <footer className="mastfoot mt-auto">
        <div className="inner">
          <p>
            Project Created by{" "}
            <a
              href="https://www.winstonheinrichs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Winston Heinrichs
            </a>{" "}
            - 2024
          </p>{" "}
        </div>
      </footer>
    </div>
  );
}
