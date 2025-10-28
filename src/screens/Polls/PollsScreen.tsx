import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { pollsAPI } from '../../services/api';
import {
  SearchBar,
  CategoryFilter,
  MarketCard,
  FeaturedBanner,
} from '../../components/Polls';
import { PlantDecoration, SmallPlantDecoration } from '../../components/Polls/SVGDecorations';

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

const PollsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const user = useSelector((state: RootState) => state.auth.user);

  const notifications = [
    { id: '1', message: 'Your bid on Bitcoin market was successful', type: 'bid', market: 'Crypto' },
    { id: '2', message: 'New poll: Tesla stock prediction', type: 'new', market: 'Stocks' },
    { id: '3', message: 'Poll results updated for Politics market', type: 'update', market: 'Politics' },
  ];

  // Mock data for now
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
      category: 'Crypto',
      categoryColor: '#30c285',
      changePercent: '+- 12 %',
      question: 'Will Bitcoin reach $150k by end of 2025?',
      yesPrice: '₹ 0.42',
      noPrice: '₹ 0.58',
      volume: '₹89K',
    },
  ];

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await pollsAPI.getTrending();
      // setMarkets(response.data);
      setMarkets(mockMarkets);
    } catch (error) {
      console.error('Failed to load markets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMarkets();
  };

  const handleNotificationPress = () => {
    if (showNotifications) {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowNotifications(false));
    } else {
      setShowNotifications(true);
      Animated.spring(notificationAnim, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNotificationItemPress = (notification: any) => {
    setShowNotifications(false);
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    // Navigate to relevant screen based on notification type
    console.log('Navigate to notification:', notification);
  };

  const handleProfilePress = () => {
    (navigation as any).navigate('Profile');
  };

  const handleMarketPress = (market: Market) => {
    (navigation as any).navigate('MarketPollDetail', { market });
  };

  const handleSeeAll = () => {
    (navigation as any).navigate('AllPolls');
  };

  const handleExploreFeatured = () => {
    const featuredMarket: Market = {
      id: 'featured',
      category: 'Politics',
      categoryColor: '#179E66',
      changePercent: '+ 8 %',
      question: "Bihar Assembly Elections 2025'",
      yesPrice: '₹ 0.52',
      noPrice: '₹ 0.48',
      volume: '₹2.5M',
    };
    (navigation as any).navigate('MarketPollDetail', { market: featuredMarket });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Wrapper with overflow hidden to clip the decorations */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={['#0000', '#0a1913']}
          style={styles.header}
        >
          {/* Large Plant SVG Decoration */}
          <PlantDecoration />
          <SmallPlantDecoration />

          {/* Navigation */}
          <View style={styles.nav}>
            <View style={styles.navLeft}>
              <Text style={styles.welcomeText}>Welcome back 👋</Text>
              <Text style={styles.userName}>
                {user?.fullName || 'Guest User'}
              </Text>
            </View>
          <View style={styles.navRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationPress}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfilePress}>
              <Ionicons name="person" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <Animated.View
            style={[
              styles.notificationDropdown,
              {
                opacity: notificationAnim,
                transform: [
                  {
                    translateY: notificationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationItem}
                onPress={() => handleNotificationItemPress(notification)}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="notifications" size={16} color="#179E66" />
                </View>
                <Text style={styles.notificationText} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Search Bar */}
        <SearchBar />

        {/* Featured Banner */}
        <FeaturedBanner onExplorePress={handleExploreFeatured} />
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Trending Header */}
          <View style={styles.trendingHeader}>
            <Text style={styles.trendingTitle}>Trending Now</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAll}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#474747" />
            </TouchableOpacity>
          </View>

          {/* Category Filters */}
          <CategoryFilter />

          {/* Markets List */}
          {markets.map((market) => (
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
    backgroundColor: '#000',
  },
  headerWrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    paddingTop: 10,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  navLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#dfdfdf',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#dfdfdf',
    letterSpacing: -0.5,
  },
  navRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#207372',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0a1913',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  trendingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff4f4',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    color: '#dfdfdf',
    textDecorationLine: 'underline',
  },
  notificationDropdown: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 8,
    width: 300,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0a1913',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
});

export default PollsScreen;