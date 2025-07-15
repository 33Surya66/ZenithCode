const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    walletAddress: String
    zthBalance: Float!
    contributions: [Contribution!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Contribution {
    id: ID!
    patternHash: String!
    language: String!
    domain: String!
    complexity: Int!
    tokensEarned: Float!
    createdAt: DateTime!
  }

  type Pattern {
    id: ID!
    hash: String!
    language: String!
    domain: String!
    complexity: Int!
    usageCount: Int!
    averageRating: Float!
    tags: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Insight {
    id: ID!
    title: String!
    description: String!
    type: InsightType!
    data: JSON!
    timeframe: String!
    createdAt: DateTime!
  }

  type TokenTransaction {
    id: ID!
    userId: ID!
    type: TransactionType!
    amount: Float!
    description: String!
    timestamp: DateTime!
  }

  type ComputeJob {
    id: ID!
    userId: ID!
    type: JobType!
    status: JobStatus!
    cost: Float!
    result: String
    createdAt: DateTime!
    completedAt: DateTime
  }

  type Query {
    # User queries
    user(id: ID!): User
    me: User
    
    # Pattern queries
    patterns(
      language: String
      domain: String
      limit: Int
      offset: Int
    ): [Pattern!]!
    pattern(id: ID!): Pattern
    
    # Contribution queries
    contributions(userId: ID!): [Contribution!]!
    
    # Insight queries
    insights(timeframe: String!): [Insight!]!
    trends(language: String!): [Insight!]!
    
    # Token queries
    tokenBalance(userId: ID!): Float!
    tokenTransactions(userId: ID!): [TokenTransaction!]!
    
    # Compute queries
    computeJobs(userId: ID!): [ComputeJob!]!
    computeJob(id: ID!): ComputeJob!
  }

  type Mutation {
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # Pattern mutations
    contributePattern(input: PatternInput!): Contribution!
    ratePattern(patternId: ID!, rating: Int!): Boolean!
    
    # Token mutations
    claimTokens(contributionId: ID!): Boolean!
    transferTokens(toUserId: ID!, amount: Float!): Boolean!
    
    # Compute mutations
    createComputeJob(input: ComputeJobInput!): ComputeJob!
    cancelComputeJob(jobId: ID!): Boolean!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    walletAddress: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input PatternInput {
    code: String!
    language: String!
    domain: String!
    description: String
    tags: [String!]
  }

  input ComputeJobInput {
    type: JobType!
    parameters: JSON!
    cost: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum InsightType {
    TREND
    PATTERN
    PERFORMANCE
    SECURITY
  }

  enum TransactionType {
    EARNED
    SPENT
    TRANSFERRED
  }

  enum JobType {
    TRAINING
    INFERENCE
    TESTING
    ANALYSIS
  }

  enum JobStatus {
    PENDING
    RUNNING
    COMPLETED
    FAILED
    CANCELLED
  }

  scalar DateTime
  scalar JSON
`;

module.exports = typeDefs; 