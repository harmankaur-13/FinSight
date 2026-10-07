import React from 'react';
import { describe, it, expect } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute Role-Based Access Control', () => {
  it('redirects to /login when user is null or not logged in', () => {
    const unauthUser = null;
    const element = ProtectedRoute({ user: unauthUser });
    expect(element.props.to).toBe('/login');
    expect(element.props.replace).toBe(true);

    const loggedOutUser = { isLoggedIn: false };
    const element2 = ProtectedRoute({ user: loggedOutUser });
    expect(element2.props.to).toBe('/login');
  });

  it('redirects to /onboarding when onboarding is required but not completed', () => {
    const onboardingUser = {
      isLoggedIn: true,
      needsOnboarding: true,
      userType: 'student'
    };
    const element = ProtectedRoute({ user: onboardingUser, requireOnboardingCompleted: true });
    expect(element.props.to).toBe('/onboarding');
    expect(element.props.replace).toBe(true);
  });

  it('allows access to onboarding route when requireOnboardingCompleted is false', () => {
    const onboardingUser = {
      isLoggedIn: true,
      needsOnboarding: true,
      userType: 'student'
    };
    const child = <div id="onboarding-page">Onboarding</div>;
    const element = ProtectedRoute({
      user: onboardingUser,
      requireOnboardingCompleted: false,
      children: child
    });
    expect(element).toBe(child);
  });

  describe('Demo Mode Permissions', () => {
    const demoUser = {
      isLoggedIn: true,
      needsOnboarding: false,
      isDemo: true,
      userType: 'student'
    };

    it('allows demo user to access student dashboard', () => {
      const child = <div id="student-dash">Student Dashboard</div>;
      const element = ProtectedRoute({
        user: demoUser,
        allowedRole: 'student',
        children: child
      });
      expect(element).toBe(child);
    });

    it('allows demo user to preview business dashboard', () => {
      const child = <div id="business-dash">Business Dashboard</div>;
      const element = ProtectedRoute({
        user: demoUser,
        allowedRole: 'business',
        children: child
      });
      expect(element).toBe(child);
    });

    it('allows demo user to preview big tech dashboard', () => {
      const child = <div id="tech-dash">Tech Dashboard</div>;
      const element = ProtectedRoute({
        user: demoUser,
        allowedRole: 'tech',
        children: child
      });
      expect(element).toBe(child);
    });
  });

  describe('Student Role Permissions (Real Accounts)', () => {
    const studentUser = {
      isLoggedIn: true,
      needsOnboarding: false,
      isDemo: false,
      userType: 'student'
    };

    it('allows student to access student dashboard (allowedRole="student")', () => {
      const child = <div id="student-dash">Student Dashboard</div>;
      const element = ProtectedRoute({
        user: studentUser,
        allowedRole: 'student',
        children: child
      });
      expect(element).toBe(child);
    });

    it('blocks student from accessing business dashboard and redirects to /student-dashboard', () => {
      const child = <div id="business-dash">Business Dashboard</div>;
      const element = ProtectedRoute({
        user: studentUser,
        allowedRole: 'business',
        children: child
      });
      expect(element.props.to).toBe('/student-dashboard');
      expect(element.props.replace).toBe(true);
    });

    it('blocks student from accessing big tech dashboard and redirects to /student-dashboard', () => {
      const child = <div id="tech-dash">Tech Dashboard</div>;
      const element = ProtectedRoute({
        user: studentUser,
        allowedRole: 'tech',
        children: child
      });
      expect(element.props.to).toBe('/student-dashboard');
      expect(element.props.replace).toBe(true);
    });
  });

  describe('Business Role Permissions (Real Accounts)', () => {
    const businessUser = {
      isLoggedIn: true,
      needsOnboarding: false,
      isDemo: false,
      userType: 'business'
    };

    it('allows business user to access business dashboard (allowedRole="business")', () => {
      const child = <div id="business-dash">Business Dashboard</div>;
      const element = ProtectedRoute({
        user: businessUser,
        allowedRole: 'business',
        children: child
      });
      expect(element).toBe(child);
    });

    it('blocks business user from accessing student dashboard and redirects to /business-dashboard', () => {
      const child = <div id="student-dash">Student Dashboard</div>;
      const element = ProtectedRoute({
        user: businessUser,
        allowedRole: 'student',
        children: child
      });
      expect(element.props.to).toBe('/business-dashboard');
      expect(element.props.replace).toBe(true);
    });

    it('blocks business user from accessing big tech dashboard and redirects to /business-dashboard', () => {
      const child = <div id="tech-dash">Tech Dashboard</div>;
      const element = ProtectedRoute({
        user: businessUser,
        allowedRole: 'tech',
        children: child
      });
      expect(element.props.to).toBe('/business-dashboard');
      expect(element.props.replace).toBe(true);
    });
  });

  describe('Big Tech Role Permissions (Real Accounts)', () => {
    const techUser = {
      isLoggedIn: true,
      needsOnboarding: false,
      isDemo: false,
      userType: 'tech'
    };

    it('allows tech user to access tech dashboard (allowedRole="tech")', () => {
      const child = <div id="tech-dash">Tech Dashboard</div>;
      const element = ProtectedRoute({
        user: techUser,
        allowedRole: 'tech',
        children: child
      });
      expect(element).toBe(child);
    });

    it('blocks tech user from accessing student dashboard and redirects to /tech-dashboard', () => {
      const child = <div id="student-dash">Student Dashboard</div>;
      const element = ProtectedRoute({
        user: techUser,
        allowedRole: 'student',
        children: child
      });
      expect(element.props.to).toBe('/tech-dashboard');
      expect(element.props.replace).toBe(true);
    });

    it('blocks tech user from accessing business dashboard and redirects to /tech-dashboard', () => {
      const child = <div id="business-dash">Business Dashboard</div>;
      const element = ProtectedRoute({
        user: techUser,
        allowedRole: 'business',
        children: child
      });
      expect(element.props.to).toBe('/tech-dashboard');
      expect(element.props.replace).toBe(true);
    });
  });
});
