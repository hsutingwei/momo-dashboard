import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  Package, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Star,
  Tag,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  keyword: string;
  price: number;
  is_complete: boolean;
  created_at: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock additional data for the product modal
const getProductSummary = (productId: string) => {
  const summaries: { [key: string]: any } = {
    'PRD001': {
      totalSales: 245,
      monthlyGrowth: 6.5,
      totalComments: 18,
      averageRating: 4.2,
      sentimentScore: 0.65,
      topKeywords: ['音質', '舒適', '無線', '電池'],
      description: '高品質無線藍牙耳機，採用先進的主動降噪技術，為您提供卓越的音響體驗。',
      features: [
        '40小時超長續航',
        '主動降噪技術',
        '快速充電15分鐘播放3小時',
        '人體工學設計'
      ]
    },
    'PRD002': {
      totalSales: 189,
      monthlyGrowth: -3.1,
      totalComments: 12,
      averageRating: 4.5,
      sentimentScore: 0.78,
      topKeywords: ['精準', '健康', '運動', '防水'],
      description: '智能健身追蹤器，全天候監測您的健康狀況，讓運動更科學更有效。',
      features: [
        '24/7心率監測',
        '50米防水設計',
        '14天超長續航',
        '50+運動模式'
      ]
    },
    'PRD003': {
      totalSales: 156,
      monthlyGrowth: 9.9,
      totalComments: 8,
      averageRating: 4.0,
      sentimentScore: 0.52,
      topKeywords: ['RGB', '機械', '遊戲', '手感'],
      description: '專業機械式遊戲鍵盤，配備RGB炫彩背光，為遊戲玩家提供極致的操控體驗。',
      features: [
        '機械軸體設計',
        '1680萬色RGB背光',
        '防鬼鍵技術',
        '鋁合金面板'
      ]
    },
    'PRD004': {
      totalSales: 98,
      monthlyGrowth: 0,
      totalComments: 6,
      averageRating: 3.8,
      sentimentScore: 0.35,
      topKeywords: ['多功能', '便攜', '擴展', '發熱'],
      description: '7合1多功能USB-C集線器，一個設備解決所有連接需求。',
      features: [
        '7個擴展接口',
        'USB 3.0高速傳輸',
        '4K HDMI視頻輸出',
        '100W功率傳遞'
      ]
    },
    'PRD005': {
      totalSales: 67,
      monthlyGrowth: -24.7,
      totalComments: 4,
      averageRating: 4.1,
      sentimentScore: 0.48,
      topKeywords: ['便攜', '穩定', '輕量', '角度'],
      description: '輕巧便攜的手機支架，多角度調節，讓您隨時享受最佳的觀看體驗。',
      features: [
        '多角度調節',
        '摺疊便攜設計',
        '防滑底座',
        '兼容各種設備'
      ]
    }
  };
  
  return summaries[productId] || {
    totalSales: 0,
    monthlyGrowth: 0,
    totalComments: 0,
    averageRating: 0,
    sentimentScore: 0,
    topKeywords: [],
    description: '暫無產品描述',
    features: []
  };
};

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(false);

  if (!product) return null;

  const summary = getProductSummary(product.id);

  const CollapsibleSection = ({ 
    isOpen, 
    onToggle, 
    title, 
    icon: Icon, 
    children 
  }: {
    isOpen: boolean;
    onToggle: () => void;
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="transition-all duration-200">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <span>{title}</span>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Basic Info - Default Open */}
          <CollapsibleSection
            isOpen={isBasicInfoOpen}
            onToggle={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
            title="基本資訊"
            icon={Package}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">產品編號</div>
                <div className="font-mono">{product.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">售價</div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${product.price}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">狀態</div>
                <Badge variant={product.is_complete ? "default" : "secondary"}>
                  {product.is_complete ? "已完成" : "進行中"}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">建立日期</div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(product.created_at).toLocaleDateString('zh-TW')}</span>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Product Description - Default Collapsed */}
          <CollapsibleSection
            isOpen={isDescriptionOpen}
            onToggle={() => setIsDescriptionOpen(!isDescriptionOpen)}
            title="產品描述"
            icon={Package}
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">{summary.description}</p>
              <div className="space-y-2">
                <h4>主要特色</h4>
                <ul className="space-y-1">
                  {summary.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* Sales & Performance Summary - Default Collapsed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CollapsibleSection
              isOpen={isSalesOpen}
              onToggle={() => setIsSalesOpen(!isSalesOpen)}
              title="銷售數據"
              icon={TrendingUp}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>總銷量</span>
                  </div>
                  <span className="text-2xl">{summary.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>月增長率</span>
                  <Badge 
                    variant={summary.monthlyGrowth > 0 ? "default" : summary.monthlyGrowth < 0 ? "destructive" : "secondary"}
                    className={
                      summary.monthlyGrowth > 0 ? "bg-green-100 text-green-800" :
                      summary.monthlyGrowth < 0 ? "bg-red-100 text-red-800" :
                      ""
                    }
                  >
                    {summary.monthlyGrowth > 0 ? '+' : ''}{summary.monthlyGrowth.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              isOpen={isCommentsOpen}
              onToggle={() => setIsCommentsOpen(!isCommentsOpen)}
              title="評論統計"
              icon={MessageSquare}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>評論總數</span>
                  </div>
                  <span className="text-2xl">{summary.totalComments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>平均評分</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{summary.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>情感分數</span>
                  <Badge 
                    variant="secondary"
                    className={
                      summary.sentimentScore > 0.5 ? "bg-green-100 text-green-800" :
                      summary.sentimentScore > 0.2 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }
                  >
                    {(summary.sentimentScore * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Keywords Analysis - Default Collapsed */}
          <CollapsibleSection
            isOpen={isKeywordsOpen}
            onToggle={() => setIsKeywordsOpen(!isKeywordsOpen)}
            title="關鍵字分析"
            icon={Tag}
          >
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">產品標籤</div>
                <div className="flex flex-wrap gap-1">
                  {product.keyword.split(', ').map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">熱門評論關鍵字</div>
                <div className="flex flex-wrap gap-1">
                  {summary.topKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </DialogContent>
    </Dialog>
  );
}