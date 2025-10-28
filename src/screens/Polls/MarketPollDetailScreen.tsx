import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Market {
  id: string;
  category: string;
  categoryColor: string;
  question: string;
  yesPrice: string;
  noPrice: string;
  volume: string;
  description?: string;
  endDate?: string;
  participants?: number;
}

const MarketPollDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { market } = route.params as { market: Market };
  
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectSide = (side: 'yes' | 'no') => {
    setSelectedSide(side);
    Animated.spring(slideAnim, {
      toValue: side === 'yes' ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePlaceBid = () => {
    // TODO: Implement bid placement
    console.log('Placing bid:', { side: selectedSide, amount: bidAmount });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Market Info */}
        <View style={styles.marketCard}>
          <View style={styles.categoryBadge}>
            <View style={[styles.categoryDot, { backgroundColor: market.categoryColor }]} />
            <Text style={styles.categoryText}>{market.category}</Text>
          </View>

          <Text style={styles.question}>{market.question}</Text>
          <Text style={styles.description}>
            {market.description || 'Place your bid on this market prediction and earn based on the outcome.'}
          </Text>

          {/* Market Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Volume</Text>
              <Text style={styles.statValue}>{market.volume}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Participants</Text>
              <Text style={styles.statValue}>{market.participants || '1.2K'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ends</Text>
              <Text style={styles.statValue}>{market.endDate || 'Dec 31, 2025'}</Text>
            </View>
          </View>
        </View>

        {/* Current Prices */}
        <View style={styles.priceContainer}>
          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <View style={[styles.priceBadge, { backgroundColor: '#30C285' }]}>
                <Text style={styles.priceBadgeText}>YES</Text>
              </View>
              <View style={styles.priceValue}>
                <Text style={styles.priceAmount}>{market.yesPrice}</Text>
                <Text style={styles.priceLabel}>Current Price</Text>
              </View>
            </View>
            <View style={styles.priceStats}>
              <Text style={styles.priceChange}>+12.5%</Text>
              <Ionicons name="trending-up" size={16} color="#30C285" />
            </View>
          </View>

          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <View style={[styles.priceBadge, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.priceBadgeText}>NO</Text>
              </View>
              <View style={styles.priceValue}>
                <Text style={styles.priceAmount}>{market.noPrice}</Text>
                <Text style={styles.priceLabel}>Current Price</Text>
              </View>
            </View>
            <View style={styles.priceStats}>
              <Text style={[styles.priceChange, { color: '#FF6B6B' }]}>-12.5%</Text>
              <Ionicons name="trending-down" size={16} color="#FF6B6B" />
            </View>
          </View>
        </View>

        {/* Select Side */}
        <View style={styles.selectContainer}>
          <Text style={styles.sectionTitle}>Select Your Position</Text>
          <View style={styles.toggleContainer}>
            <Animated.View
              style={[
                styles.toggleBackground,
                {
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 152],
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => handleSelectSide('yes')}>
              <Text style={[
                styles.toggleText,
                selectedSide === 'yes' && styles.toggleTextActive
              ]}>
                YES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => handleSelectSide('no')}>
              <Text style={[
                styles.toggleText,
                selectedSide === 'no' && styles.toggleTextActive
              ]}>
                NO
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Place Bid */}
        {selectedSide && (
          <View style={styles.bidContainer}>
            <Text style={styles.bidTitle}>Place Your Bid</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.inputAmount}>0</Text>
              </View>
            </View>
            <View style={styles.quickAmounts}>
              {[100, 500, 1000, 5000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setBidAmount(amount.toString())}>
                  <Text style={styles.quickAmountText}>₹{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.placeBidButton, !selectedSide && styles.placeBidButtonDisabled]}
              onPress={handlePlaceBid}>
              <Text style={styles.placeBidText}>Place Bid</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1913',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  marketCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    paddingTop: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  priceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  priceValue: {
    flex: 1,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  priceLabel: {
    fontSize: 10,
    color: '#666',
  },
  priceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30C285',
    marginRight: 4,
  },
  selectContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  toggleBackground: {
    position: 'absolute',
    width: '48%',
    top: 4,
    bottom: 4,
    backgroundColor: '#179E66',
    borderRadius: 8,
    margin: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  bidContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a1913',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  inputAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#0a1913',
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  placeBidButton: {
    paddingVertical: 16,
    backgroundColor: '#179E66',
    borderRadius: 12,
    alignItems: 'center',
  },
  placeBidButtonDisabled: {
    backgroundColor: '#666',
  },
  placeBidText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MarketPollDetailScreen;

