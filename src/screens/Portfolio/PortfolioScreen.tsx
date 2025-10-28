// src/screens/Portfolio/PortfolioScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

export default function PortfolioScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  const portfolioStats = {
    totalInvested: 25000,
    currentValue: 28500,
    totalReturns: 3500,
    activePositions: 12,
  };

  const activePositions = [
    {
      id: '1',
      title: 'Will Bitcoin reach $100k by end of 2024?',
      position: 'Yes',
      invested: 5000,
      currentValue: 5800,
      change: 16,
      status: 'winning',
    },
    {
      id: '2',
      title: 'India to win World Cup 2024?',
      position: 'No',
      invested: 3000,
      currentValue: 2700,
      change: -10,
      status: 'losing',
    },
    {
      id: '3',
      title: 'Tesla stock above $300 this quarter?',
      position: 'Yes',
      invested: 4000,
      currentValue: 4200,
      change: 5,
      status: 'winning',
    },
  ];

  const completedPositions = [
    {
      id: '1',
      title: 'US Elections 2024 outcome',
      position: 'Yes',
      invested: 2000,
      finalValue: 2400,
      profit: 400,
      result: 'won',
    },
    {
      id: '2',
      title: 'Oil prices above $90 in Q1',
      position: 'No',
      invested: 1500,
      finalValue: 1350,
      profit: -150,
      result: 'lost',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Blur */}
      <View style={styles.headerContainer}>
        <BlurView intensity={30} tint="dark" style={styles.header}>
          <Text style={styles.headerTitle}>Portfolio</Text>
        </BlurView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Portfolio Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Invested</Text>
              <Text style={styles.summaryValue}>₹{portfolioStats.totalInvested.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Value</Text>
              <Text style={styles.summaryValue}>₹{portfolioStats.currentValue.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.returnsContainer}>
            <View style={styles.returnsLeft}>
              <Text style={styles.returnsLabel}>Total Returns</Text>
              <Text style={[styles.returnsValue, { color: portfolioStats.totalReturns >= 0 ? '#4CAF50' : '#F44336' }]}>
                {portfolioStats.totalReturns >= 0 ? '+' : ''}₹{portfolioStats.totalReturns.toLocaleString()}
              </Text>
            </View>
            <View style={styles.percentageBadge}>
              <Icon 
                name={portfolioStats.totalReturns >= 0 ? 'trending-up' : 'trending-down'} 
                size={16} 
                color={portfolioStats.totalReturns >= 0 ? '#4CAF50' : '#F44336'} 
              />
              <Text style={[styles.percentageText, { color: portfolioStats.totalReturns >= 0 ? '#4CAF50' : '#F44336' }]}>
                {((portfolioStats.totalReturns / portfolioStats.totalInvested) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="briefcase" size={20} color="#179E66" />
            <Text style={styles.statValue}>{portfolioStats.activePositions}</Text>
            <Text style={styles.statLabel}>Active Positions</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Icon name="chart-timeline-variant" size={20} color="#2196F3" />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Total Trades</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
            onPress={() => setSelectedTab('active')}
            activeOpacity={0.7}>
            <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
            onPress={() => setSelectedTab('completed')}
            activeOpacity={0.7}>
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Positions List */}
        <View style={styles.positionsContainer}>
          {selectedTab === 'active' ? (
            activePositions.map((position) => (
              <TouchableOpacity key={position.id} style={styles.positionCard} activeOpacity={0.8}>
                <View style={styles.positionHeader}>
                  <Text style={styles.positionTitle}>{position.title}</Text>
                  <View style={[styles.positionBadge, position.status === 'winning' ? styles.winningBadge : styles.losingBadge]}>
                    <Text style={styles.positionBadgeText}>{position.position}</Text>
                  </View>
                </View>

                <View style={styles.positionStats}>
                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Invested</Text>
                    <Text style={styles.positionStatValue}>₹{position.invested.toLocaleString()}</Text>
                  </View>

                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Current</Text>
                    <Text style={styles.positionStatValue}>₹{position.currentValue.toLocaleString()}</Text>
                  </View>

                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Returns</Text>
                    <Text style={[styles.positionChange, { color: position.change >= 0 ? '#4CAF50' : '#F44336' }]}>
                      {position.change >= 0 ? '+' : ''}{position.change}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            completedPositions.map((position) => (
              <TouchableOpacity key={position.id} style={styles.positionCard} activeOpacity={0.8}>
                <View style={styles.positionHeader}>
                  <Text style={styles.positionTitle}>{position.title}</Text>
                  <View style={[styles.resultBadge, position.result === 'won' ? styles.wonBadge : styles.lostBadge]}>
                    <Icon name={position.result === 'won' ? 'check-circle' : 'close-circle'} size={14} color="#fff" />
                    <Text style={styles.resultBadgeText}>{position.result.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.positionStats}>
                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Invested</Text>
                    <Text style={styles.positionStatValue}>₹{position.invested.toLocaleString()}</Text>
                  </View>

                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Final Value</Text>
                    <Text style={styles.positionStatValue}>₹{position.finalValue.toLocaleString()}</Text>
                  </View>

                  <View style={styles.positionStat}>
                    <Text style={styles.positionStatLabel}>Profit/Loss</Text>
                    <Text style={[styles.positionChange, { color: position.profit >= 0 ? '#4CAF50' : '#F44336' }]}>
                      {position.profit >= 0 ? '+' : ''}₹{position.profit}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1913',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    fontFamily: 'AbrilFatface_400Regular',
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#179E66',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  returnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  returnsLeft: {
    flex: 1,
  },
  returnsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    
  },
  returnsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'AbrilFatface_400Regular',
  },
  percentageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#179E66',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#fff',
  },
  positionsContainer: {
    paddingHorizontal: 20,
  },
  positionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  positionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
    marginRight: 12,
  },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  winningBadge: {
    backgroundColor: '#4CAF5020',
  },
  losingBadge: {
    backgroundColor: '#F4433620',
  },
  positionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  positionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionStat: {
    flex: 1,
  },
  positionStatLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  positionStatValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  positionChange: {
    fontSize: 15,
    fontWeight: '700',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  wonBadge: {
    backgroundColor: '#4CAF50',
  },
  lostBadge: {
    backgroundColor: '#F44336',
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});