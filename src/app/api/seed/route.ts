import { db } from "@/db";
import {
  tenants,
  users,
  manuscripts,
  chapters,
  storyBibleCharacters,
  storyBibleWorldFacts,
  storyBibleTimeline,
  aiSuggestions,
  blockchainRecords,
  smartContracts,
  books,
  warehouses,
  stockItems,
  stockMovements,
  suppliers,
  purchaseOrders,
  purchaseOrderItems,
  salesOrders,
  salesOrderItems,
  notifications,
  tasks,
  betaReaderAssignments,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST() {
  try {
    // Check if already seeded
    const existingTenants = await db.select().from(tenants).limit(1);
    if (existingTenants.length > 0) {
      return successResponse({ message: "Database already seeded" });
    }

    // Create demo tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: "Quantum Press",
        slug: "quantum-press",
        plan: "enterprise",
      })
      .returning();

    const tenantId = tenant.id;

    // Create demo users
    const pw = hashPassword("demo123");
    const demoUsers = await db
      .insert(users)
      .values([
        { tenantId, email: "author@demo.com", passwordHash: pw, firstName: "Dr. Elara", lastName: "Voss", role: "author" },
        { tenantId, email: "editor@demo.com", passwordHash: pw, firstName: "James", lastName: "Park", role: "editor" },
        { tenantId, email: "publisher@demo.com", passwordHash: pw, firstName: "Sarah", lastName: "Chen", role: "publisher" },
        { tenantId, email: "admin@demo.com", passwordHash: pw, firstName: "Admin", lastName: "User", role: "admin" },
        { tenantId, email: "beta@demo.com", passwordHash: pw, firstName: "Beta", lastName: "Reader", role: "beta_reader" },
        { tenantId, email: "alex@demo.com", passwordHash: pw, firstName: "Alex", lastName: "Park", role: "author" },
        { tenantId, email: "omar@demo.com", passwordHash: pw, firstName: "Omar", lastName: "Hassan", role: "author" },
        { tenantId, email: "maria@demo.com", passwordHash: pw, firstName: "Maria", lastName: "Garcia", role: "author" },
      ])
      .returning();

    const authorUser = demoUsers[0];
    const betaUser = demoUsers[4];
    const alexUser = demoUsers[5];

    // Create manuscripts
    const [ms1] = await db
      .insert(manuscripts)
      .values({
        tenantId,
        title: "The Quantum Garden",
        authorId: authorUser.id,
        genre: "Sci-Fi",
        wordCount: 78450,
        status: "in_review",
        currentVersion: 3,
        synopsis: "When Dr. Elara Voss arrives at a distant world's quantum garden, she discovers a living alien ecosystem that defies everything science knows.",
        aiAnalysisComplete: true,
      })
      .returning();

    const [ms2] = await db
      .insert(manuscripts)
      .values({
        tenantId,
        title: "Whispers of the Forgotten",
        authorId: demoUsers[2].id,
        genre: "Fantasy",
        wordCount: 112000,
        status: "draft",
        currentVersion: 1,
      })
      .returning();

    const [ms3] = await db
      .insert(manuscripts)
      .values({
        tenantId,
        title: "The Last Algorithm",
        authorId: alexUser.id,
        genre: "Thriller",
        wordCount: 65200,
        status: "approved",
        currentVersion: 5,
      })
      .returning();

    // Create chapters for ms1
    await db.insert(chapters).values([
      { manuscriptId: ms1.id, chapterNumber: 1, title: "First Light", content: "The quantum garden stretched before them...", wordCount: 5230, status: "approved" },
      { manuscriptId: ms1.id, chapterNumber: 2, title: "Breach", content: "The readings spiked without warning...", wordCount: 4870, status: "approved" },
      { manuscriptId: ms1.id, chapterNumber: 3, title: "Convergence", content: "Two paths diverged in the bioluminescent forest...", wordCount: 5100, status: "ai_reviewed" },
      { manuscriptId: ms1.id, chapterNumber: 12, title: "The Quantum Garden", content: "The quantum garden stretched before them, its fractal blossoms pulsing...", wordCount: 1247, status: "draft" },
    ]);

    // Story Bible - Characters
    await db.insert(storyBibleCharacters).values([
      { manuscriptId: ms1.id, name: "Dr. Elara Voss", age: "34", physicalDescription: "Tall, athletic, short auburn hair, green eyes", personality: "Brilliant, methodical, empathetic", arc: "Cautious researcher → bold explorer", relationships: "Marcus (romantic tension)", firstAppearance: "Ch. 1", lastAppearance: "Ch. 15", isApproved: true },
      { manuscriptId: ms1.id, name: "Marcus Chen", age: "31", physicalDescription: "Blue eyes, lean build", personality: "Charming, impulsive", arc: "Supports Elara while confronting fear of failure", relationships: "Elara's field partner", firstAppearance: "Ch. 1", lastAppearance: "Ch. 14", isApproved: true },
      { manuscriptId: ms1.id, name: "The Gardener", age: "Unknown", physicalDescription: "Shifting form, bioluminescent", personality: "Ancient, patient, speaks in metaphors", arc: "Antagonist-ally", relationships: "Connected to garden ecosystem", firstAppearance: "Ch. 5", lastAppearance: "Ch. 15", isApproved: false },
    ]);

    // Story Bible - World Facts
    await db.insert(storyBibleWorldFacts).values([
      { manuscriptId: ms1.id, category: "Science", fact: "Quantum gardens exist on planets with extreme magnetic fields", sourceChapter: "Ch. 2", isApproved: true },
      { manuscriptId: ms1.id, category: "Science", fact: "FTL travel takes 17 minutes per light-year via quantum tunneling", sourceChapter: "Ch. 1", isApproved: true },
      { manuscriptId: ms1.id, category: "Culture", fact: "The Gardener's species communicates through bioluminescent patterns", sourceChapter: "Ch. 5", isApproved: true },
    ]);

    // Timeline
    await db.insert(storyBibleTimeline).values([
      { manuscriptId: ms1.id, event: "Mission launch from Earth Orbital Station", chapter: "Ch. 1", sequence: 1, isApproved: true },
      { manuscriptId: ms1.id, event: "Arrival at destination planet", chapter: "Ch. 2", sequence: 2, isApproved: true },
      { manuscriptId: ms1.id, event: "First contact with The Gardener", chapter: "Ch. 5", sequence: 3, isApproved: true },
    ]);

    // AI Suggestions
    await db.insert(aiSuggestions).values([
      { manuscriptId: ms1.id, agentType: "structural_architect", category: "pacing", suggestion: "Chapter 7 pacing is too slow relative to surrounding chapters.", severity: "warning", status: "pending" },
      { manuscriptId: ms1.id, agentType: "line_editor", category: "repetition", suggestion: "Sentence 'She walked to the door' appears 3 times in Chapter 4.", severity: "info", status: "pending" },
      { manuscriptId: ms1.id, agentType: "continuity_guardian", category: "contradiction", suggestion: "Marcus has blue eyes in Ch.3 but green in Ch.12.", severity: "critical", status: "pending" },
      { manuscriptId: ms1.id, agentType: "market_analyst", category: "comparables", suggestion: "Comparable title 'Project Hail Mary' by Andy Weir — similar themes.", severity: "info", status: "accepted" },
      { manuscriptId: ms1.id, agentType: "authenticity_auditor", category: "authenticity", suggestion: "Human authenticity score: 94/100.", severity: "info", status: "pending" },
    ]);

    // Blockchain records
    await db.insert(blockchainRecords).values([
      { tenantId, manuscriptId: ms1.id, hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", txId: "TX-2025-001247", type: "copyright" },
      { tenantId, manuscriptId: ms1.id, hash: "0x3f758864a0e7cc29c2bf9f47e5a23c06e52f33dbb2c56f2e05e0e05f2bbd5a23", txId: "TX-2025-001180", type: "copyright" },
    ]);

    // Smart contracts
    await db.insert(smartContracts).values([
      { manuscriptId: ms1.id, stakeholder: "Dr. Elara Voss (Author)", percentage: "60.00", contractAddress: "0x1234567890abcdef", isActive: true },
      { manuscriptId: ms1.id, stakeholder: "Quantum Press (Publisher)", percentage: "25.00", contractAddress: "0xabcdef1234567890", isActive: true },
      { manuscriptId: ms1.id, stakeholder: "Editor: James Park", percentage: "10.00", contractAddress: "0x0987654321fedcba", isActive: true },
    ]);

    // Warehouses
    const [wh1] = await db.insert(warehouses).values({ tenantId, name: "NYC Main Distribution", address: "450 Industrial Blvd, Newark, NJ", city: "Newark", country: "US", capacity: 50000, currentUtilization: 23400, latitude: "40.7357", longitude: "-74.1724" }).returning();
    const [wh2] = await db.insert(warehouses).values({ tenantId, name: "LA West Fulfillment", address: "1200 Commerce Dr, Los Angeles, CA", city: "Los Angeles", country: "US", capacity: 35000, currentUtilization: 15600, latitude: "33.9425", longitude: "-118.408" }).returning();

    // Books
    const [book1] = await db.insert(books).values({ tenantId, isbn: "978-0-13-468599-1", title: "The Quantum Garden", authorId: authorUser.id, manuscriptId: ms1.id, genre: "Sci-Fi", format: "hardcover", price: "24.99", costPrice: "5.00" }).returning();
    const [book2] = await db.insert(books).values({ tenantId, isbn: "978-0-13-468600-7", title: "The Quantum Garden", authorId: authorUser.id, manuscriptId: ms1.id, genre: "Sci-Fi", format: "paperback", price: "14.99", costPrice: "3.00" }).returning();
    const [book3] = await db.insert(books).values({ tenantId, isbn: "978-0-13-468601-4", title: "The Last Algorithm", authorId: alexUser.id, manuscriptId: ms3.id, genre: "Thriller", format: "hardcover", price: "22.99", costPrice: "4.50" }).returning();
    const [book4] = await db.insert(books).values({ tenantId, isbn: "978-0-13-468602-1", title: "The Last Algorithm", authorId: alexUser.id, manuscriptId: ms3.id, genre: "Thriller", format: "paperback", price: "13.99", costPrice: "2.80" }).returning();
    const [book5] = await db.insert(books).values({ tenantId, isbn: "978-0-13-468604-5", title: "Code Red: Silicon Valley", authorId: alexUser.id, genre: "Thriller", format: "hardcover", price: "24.99", costPrice: "5.00" }).returning();

    // Stock items
    await db.insert(stockItems).values([
      { tenantId, bookId: book1.id, warehouseId: wh1.id, quantity: 2340, safetyStock: 500, reorderPoint: 800 },
      { tenantId, bookId: book2.id, warehouseId: wh1.id, quantity: 5670, safetyStock: 1000, reorderPoint: 1500 },
      { tenantId, bookId: book1.id, warehouseId: wh2.id, quantity: 890, safetyStock: 300, reorderPoint: 500 },
      { tenantId, bookId: book3.id, warehouseId: wh1.id, quantity: 456, safetyStock: 200, reorderPoint: 400 },
      { tenantId, bookId: book4.id, warehouseId: wh2.id, quantity: 1800, safetyStock: 500, reorderPoint: 800 },
      { tenantId, bookId: book5.id, warehouseId: wh1.id, quantity: 1200, safetyStock: 300, reorderPoint: 600 },
      { tenantId, bookId: book5.id, warehouseId: wh2.id, quantity: 3800, safetyStock: 500, reorderPoint: 1000 },
    ]);

    // Suppliers
    const [sup1] = await db.insert(suppliers).values({ tenantId, name: "PrintMaster Inc.", type: "printer", contactEmail: "orders@printmaster.com", leadTimeDays: 14, rating: "4.80" }).returning();
    const [sup2] = await db.insert(suppliers).values({ tenantId, name: "BookPress Co.", type: "printer", contactEmail: "info@bookpress.com", leadTimeDays: 10, rating: "4.50" }).returning();

    // Purchase Orders
    const [po1] = await db.insert(purchaseOrders).values({ tenantId, supplierId: sup1.id, warehouseId: wh1.id, totalCost: "12500.00", status: "delivered" }).returning();
    await db.insert(purchaseOrderItems).values([
      { poId: po1.id, bookId: book5.id, quantity: 5000, unitCost: "2.50" },
    ]);

    // Sales Orders
    const [so1] = await db.insert(salesOrders).values({ tenantId, customerName: "Barnes & Noble", warehouseId: wh1.id, totalAmount: "4500.00", status: "fulfilled" }).returning();
    await db.insert(salesOrderItems).values([
      { salesOrderId: so1.id, bookId: book1.id, quantity: 100, unitPrice: "24.99" },
      { salesOrderId: so1.id, bookId: book2.id, quantity: 100, unitPrice: "14.99" },
    ]);

    // Beta reader assignment
    await db.insert(betaReaderAssignments).values({
      tenantId,
      manuscriptId: ms2.id,
      readerId: betaUser.id,
      deadlineAt: new Date("2025-02-15"),
      progress: 65,
      status: "in_progress",
    });

    // Notifications
    await db.insert(notifications).values([
      { userId: authorUser.id, tenantId, title: "AI Analysis Complete", message: "The Quantum Garden v3 has been analyzed by all 5 AI agents.", type: "info" },
      { userId: authorUser.id, tenantId, title: "Contradiction Detected", message: "Eye color inconsistency found for Marcus Chen.", type: "warning" },
      { userId: betaUser.id, tenantId, title: "New Assignment", message: "You have been assigned 'Whispers of the Forgotten' for beta reading.", type: "info" },
    ]);

    // Tasks
    await db.insert(tasks).values([
      { tenantId, manuscriptId: ms1.id, title: "Fix Marcus eye color in Ch.12", description: "Change 'green' to 'blue'", status: "todo", priority: "high", assigneeId: authorUser.id },
      { tenantId, manuscriptId: ms1.id, title: "Review AI suggestions for Ch.7 pacing", status: "in_progress", priority: "medium", assigneeId: authorUser.id },
      { tenantId, manuscriptId: ms2.id, title: "Complete first read-through", status: "in_progress", priority: "medium", assigneeId: betaUser.id },
    ]);

    return successResponse({
      message: "Database seeded successfully",
      counts: {
        tenants: 1,
        users: demoUsers.length,
        manuscripts: 3,
        books: 5,
        warehouses: 2,
        stockItems: 7,
        suppliers: 2,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return errorResponse("Failed to seed database: " + String(error), 500);
  }
}