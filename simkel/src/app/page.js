"use client";

import { useState } from "react";

export default function Page() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
        <nav>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Posts</a></li>
            <li><a href="#">Users</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Header */}
        <header className="header">
          <h1>Dashboard</h1>
        </header>

        {/* Cards Section */}
        <section className="cards">
          <div className="card">
            <p>120</p>
            <h3>Users</h3>
          </div>
          <div className="card">
            <h3>Total Users</h3>
            <p>58</p>
          </div>
          <div className="card">
            <h3>Drafts</h3>
            <p>12</p>
          </div>
          <div className="card">
            <h3>Published</h3>
            <p>108</p>
          </div>
        </section>

        {/* Actions + Table */}
        {/* <section>
          <div className="actions">
            <button className="btn btn-primary">New</button>
            <button className="btn">Filter</button>
            <button className="btn">Export</button>
            <button className="btn btn-danger">Delete</button>
          </div>

          <div className="table-section">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Tags</th>
                  <th>Star</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>My First Post</td>
                  <td>2025-09-01</td>
                  <td>News, Blog</td>
                  <td>⭐</td>
                  <td>2025-09-01</td>
                  <td>2025-09-05</td>
                  <td>
                    <button className="btn">View</button>
                    <button className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>Second Post</td>
                  <td>2025-09-02</td>
                  <td>Update</td>
                  <td>⭐</td>
                  <td>2025-09-02</td>
                  <td>2025-09-06</td>
                  <td>
                    <button className="btn">View</button>
                    <button className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section> */}
      </main>
    </div>
  );
}
