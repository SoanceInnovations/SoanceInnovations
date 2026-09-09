# Creating a Connected Mobile Companion for Healthcare Professionals

Source: https://www.soance.com/case-studies/vissco-connect-health-companion.html

## Summary / TLDR

Vissco Connect is a mobile ecosystem created for healthcare professionals. It brings guided exercises, fitness assessments, yoga content, condition monitoring, articles, community features, templates, and order management into a single professional companion.

The work combined product design, application development, custom API integration, quality engineering, and sustained support so a broad feature set could remain coherent and dependable in everyday use.

## Overview

Developed with Vissco , an orthopedic and physiotherapy products company, Vissco Connect was designed to support doctors through a focused mobile experience. Beyond the initial build, the brief included ongoing optimization, policy compliance, and support across a changing device and dependency landscape.

## Services provided

- Mobile product and interface design

- Cross-platform application development

- Custom API and messaging integration

- Functional, compatibility, performance, and security testing

- App-store release support and ongoing maintenance

## Challenges

- Interconnected feature set: Exercises, assessments, content, profiles, community tools, and orders all depended on shared state and data.

- Complex API behavior: Custom filtering and search fields needed predictable client-side handling.

- Long-term maintainability: Package conflicts, discontinued dependencies, and growing code complexity had to be managed carefully.

- Device-specific behavior: Camera access caused crashes on some Vivo devices and required hardware-level investigation.

- Release compliance: The application had to keep pace with Play Store and App Store policy requirements.

## Solution

The application architecture used Redux-Saga to coordinate asynchronous work and shared state. Reusable, nested components kept the interface consistent while dedicated integration patterns handled custom API behavior.

- Separated feature responsibilities into reusable modules with clearer standards.

- Refined search, filter, notification, chat, referral, and task-management flows through iterative prototypes.

- Adjusted camera permissions and device handling to address manufacturer-specific crashes.

- Tested dependency combinations, devices, and release builds against store requirements.

- Introduced phased releases, monitoring, and user feedback loops for ongoing improvement.

## Results

Vissco Connect emerged as a more cohesive professional health platform, bringing previously separate tasks into one accessible mobile experience.

- Simpler navigation across clinical resources, activities, communication, and orders

- More consistent behavior across supported devices

- A reusable component foundation for future modules

- An ongoing support model for compatibility, policy, and performance updates
