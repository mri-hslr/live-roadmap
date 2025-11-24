import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/UI/Card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">

      <Navbar />

      {/* HERO SECTION */}
      <section className="text-center pt-32 pb-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-brand-gradient">
          Plan Smarter. Ship Faster.
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A clean, modern and collaborative roadmap tool for teams who want clarity,
          alignment, and real-time coordination.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/login"
            className="px-8 py-4 bg-brand text-white rounded-xl2 shadow-card hover:bg-brand-dark transition"
          >
            Get Started
          </a>

          <a
            href="#features"
            className="px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl2 
                       hover:bg-gray-100 dark:hover:bg-card-dark transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="py-24 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why teams love LiveRoadmap
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Card>
            <h3 className="text-xl font-semibold mb-2">Real-time Editing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Work together without collisions — changes update instantly for everyone.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Smart Dependencies</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Update a task and everything linked to it shifts automatically.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Capacity Planning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize team load and prevent burnout or bottlenecks.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Snapshots</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save and compare roadmap versions over time.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Export-Ready</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Export CSV reports instantly for stakeholders with a single click.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Beautiful UI</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Clean, modern, distraction-free interface built for high-performance teams.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Card>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build a smarter roadmap?
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10">
            Join teams using LiveRoadmap to gain clarity, predictability, and alignment.
          </p>

          <a
            href="/login"
            className="px-10 py-4 bg-brand text-white rounded-xl2 shadow-card hover:bg-brand-dark transition"
          >
            Start Now
          </a>
        </Card>
      </section>

    </div>
  );
}
