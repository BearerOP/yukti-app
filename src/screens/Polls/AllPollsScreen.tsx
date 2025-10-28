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
import { useNavigation } from '@react-navigation/native';
import MarketCard from '../../components/Polls/MarketCard';

interface Market {
  
  id: string;
  category: string;
  categoryColor: string;
  changePercent: string;
  question: string;
  yesPrice: string;
  noPrice: string;
  volume: string;

}

const categories = ['All', 'Crypto', 'Stocks', 'Politics', 'Sports', 'Entertainment'];

const AllPollsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'volume'>('trending');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuAnim = useRef(new Animated.Value(0)).current;

  const mockMarkets: Market[] = [
    {
      id: '1',
      category: 'Crypto',
      categoryColor: '#30c285',
      changePercent: '+- 12 %',
      question: 'Will Bitcoin reach $150k by end of 2025?',
      yesPrice: '₹ 0.42',
      noPrice: '₹ 0.58',
      volume: '₹89K',
    },
    {
      id: '2',
      category: 'Stocks',
      categoryColor: '#30c285',
      changePercent: '+ 12 %',
      question: 'Tesla stock above $400 this quarter?',
      yesPrice: '₹ 0.22',
      noPrice: '₹ 0.68',
      volume: '₹219K',
    },
    {
      id: '3',
      category: 'Politics',
      categoryColor: '#FF6B6B',
      changePercent: '+ 5 %',
      question: 'Will BJP win 2025 elections?',
      yesPrice: '₹ 0.65',
      noPrice: '₹ 0.35',
      volume: '₹1.2M',
    },
    {
      id: '4',
      category: 'Sports',
      categoryColor: '#4ECDC4',
      changePercent: '- 8 %',
      question: 'Will India win Cricket World Cup 2025?',
      yesPrice: '₹ 0.45',
      noPrice: '₹ 0.55',
      volume: '₹890K',
    },
    {
      id: '5',
      category: 'Entertainment',
      categoryColor: '#FFA07A',
      changePercent: '+ 15 %',
      question: 'Will Dune 3 be released in 2025?',
      yesPrice: '₹ 0.38',
      noPrice: '₹ 0.62',
      volume: '₹450K',
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSortPress = () => {
    if (showSortMenu) {
      Animated.timing(sortMenuAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowSortMenu(false));
    } else {
      setShowSortMenu(true);
      Animated.spring(sortMenuAnim, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSortSelect = (sort: 'trending' | 'recent' | 'volume') => {
    setSortBy(sort);
    Animated.timing(sortMenuAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowSortMenu(false));
  };

  const filteredMarkets = selectedCategory === 'All'
    ? mockMarkets
    : mockMarkets.filter(m => m.category === selectedCategory);
  
  const handleMarketPress = (market: Market) => {
    (navigation as any).navigate('MarketPollDetail', { market });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Polls</Text>
        <TouchableOpacity onPress={handleSortPress} style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sort Menu */}
      {showSortMenu && (
        <Animated.View
          style={[
            styles.sortMenu,
            {
              opacity: sortMenuAnim,
              transform: [
                {
                  translateY: sortMenuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={styles.sortMenuItem}
            onPress={() => handleSortSelect('trending')}>
            <Text style={[styles.sortMenuText, sortBy === 'trending' && styles.sortMenuTextActive]}>
              Trending
            </Text>
            {sortBy === 'trending' && <Ionicons name="checkmark" size={20} color="#179E66" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortMenuItem}
            onPress={() => handleSortSelect('recent')}>
            <Text style={[styles.sortMenuText, sortBy === 'recent' && styles.sortMenuTextActive]}>
              Recent
            </Text>
            {sortBy === 'recent' && <Ionicons name="checkmark" size={20} color="#179E66" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortMenuItem}
            onPress={() => handleSortSelect('volume')}>
            <Text style={[styles.sortMenuText, sortBy === 'volume' && styles.sortMenuTextActive]}>
              Volume
            </Text>
            {sortBy === 'volume' && <Ionicons name="checkmark" size={20} color="#179E66" />}
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category} 
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Markets List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {filteredMarkets.map((market) => (
            <TouchableOpacity
              key={market.id}
              onPress={() => handleMarketPress(market)}
              activeOpacity={0.9}>
              <MarketCard {...market} />
            </TouchableOpacity>
          ))}
        </View>
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
    paddingVertical: 8,
    paddingTop: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  sortButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortMenu: {
    position: 'absolute',
    top: 52,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sortMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 140,
  },
  sortMenuText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  sortMenuTextActive: {
    color: '#179E66',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#179E66',
    borderColor: '#179E66',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#b0b0b0',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
});

export default AllPollsScreen;